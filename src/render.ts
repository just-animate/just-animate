import { ja } from "./types";
import { isNumeric, clamp } from "./numbers";

interface ReaderWriter {
  read: ja.AnimatorReader;
  write: ja.AnimatorRender;
}

interface Mixer {
  (
    a: ja.AnimationValue,
    b: ja.AnimationValue,
    offset: number
  ): ja.AnimationValue;
}

const htmlAttributeOnly = ["viewBox"];
const htmlPropOnly = ["innerHTML", "textContent"];
const TRANSFORM_REGEX =
  // Match on all transform functions.
  /(perspective|matrix(3d)?|skew[xy]?|(translate|scale|rotate)([xyz]|3d)?)\(/i;

const UNIT_REGEX = /^(\-?[0-9.]+)([a-z%]*)$/i;

const attributeReaderWriter: ReaderWriter = {
  read(target: HTMLElement, key: string) {
    return target.getAttribute(key) || "";
  },
  write(target: HTMLElement, key: string, value: ja.AnimationTarget) {
    target.setAttribute(key, value.toString());
  }
};

const cssVarReaderWriter: ReaderWriter = {
  read(target: HTMLElement, key: string) {
    return target.style.getPropertyValue(key);
  },
  write(target: HTMLElement, key: string, value: ja.AnimationTarget) {
    target.style.setProperty(key, value.toString());
  }
};

const propertyReaderWriter: ReaderWriter = {
  read(target: HTMLElement, key: string) {
    return target[key];
  },
  write(target: HTMLElement, key: string, value: ja.AnimationTarget) {
    target[key] = value;
  }
};

const styleReaderWriter: ReaderWriter = {
  read(target: HTMLElement, key: string) {
    return getComputedStyle(target)[key];
  },
  write(target: HTMLElement, key: string, value: ja.AnimationTarget) {
    target.style[key] = value;
  }
};

export function getAnimator(
  target: ja.AnimationTarget,
  propertyName: string
): ja.Animator {
  const readerWriter = getReaderWriter(target, propertyName);

  return {
    mix: autoMixer,
    read: readerWriter.read,
    write: readerWriter.write
  };
}

// tslint:disable-next-line:no-any
let matrix: any;
function toMatrix(value: string | number): string {
  if (!matrix) {
    // tslint:disable-next-line:no-any
    const w = window as any;
    matrix = w.WebKitCSSMatrix || w.MSCSSMatrix || w.DOMMatrix;
  }
  // TODO: ensure 3d is used with 3d at some point.
  return new matrix(value || "").toString();
}

/**
 * This mixer attempts to automatically parse CSS expressions from each value
 * and then create an interpolated value from it.
 * @param valueA The left value to mix.
 * @param valueB The right value to mix.
 * @param offset The progression offset to use.
 */
function autoMixer(
  valueA: ja.AnimationValue,
  valueB: ja.AnimationValue,
  offset: number
): ja.AnimationValue {
  return detectMixer(valueA, valueB)(valueA, valueB, offset);
}

/**
 * This mixer attempts to automatically parse CSS expressions from each value
 * and then create an interpolated value from it.
 * @param valueA The left value to mix.
 * @param valueB The right value to mix.
 * @param offset The progression offset to use.
 */
function detectMixer(
  valueA: ja.AnimationValue,
  valueB: ja.AnimationValue
): Mixer {
  const isNumericA = isNumeric(valueA);
  const isNumericB = isNumeric(valueB);
  if (isNumericA && isNumericB) {
    return numberMixer;
  }
  if (isPath(valueA) || isPath(valueB)) {
    return pathMixer;
  }
  if (isUnit(valueA) || isUnit(valueB)) {
    return unitMixer;
  }
  return fallbackMixer;
}

function numberMixer(
  a: ja.AnimationValue,
  b: ja.AnimationValue,
  o: number
): number {
  return (+a + +b) * o;
}

function isUnit(value: ja.AnimationValue): boolean {
  return !!UNIT_REGEX.test(value.toString());
}

function isPath(value: ja.AnimationValue): boolean {
  return /^([mhvlcsqt][0-9, \-.]+)+z?$/i.test(value + "");
}

function pathMixer(
  a: ja.AnimationValue,
  b: ja.AnimationValue,
  o: number
): string {
  const pathA = getAllTerms(a + "", /([mhvlcsqtz]|[0-9\-.]+)/gi);
  const pathB = getAllTerms(b + "", /([mhvlcsqtz]|[0-9\-.]+)/gi);
  if (pathA.length !== pathB.length) {
    throw new Error("Paths do not have the same number of terms");
  }
  let result = "";
  for (let i = 0; i < pathA.length; i++) {
    if (!!i) {
      result += " ";
    }
    result += autoMixer(pathA[i], pathB[i], o);
  }
  return result;
}

function unitMixer(
  a: ja.AnimationValue,
  b: ja.AnimationValue,
  o: number
): string {
  const unitA = UNIT_REGEX.exec(a + "")!;
  const unitB = UNIT_REGEX.exec(b + "")!;
  // Prefer the unit on the left.  This allows 0 and 10px to mix properly.
  return numberMixer(unitA[1], unitB[1], o) + (unitA[2] || unitB[2] || "");
}

/**
 * This mixer attempts to automatically parse CSS expressions from each value
 * and then create an interpolated value from it.
 * @param valueA The left value to mix.
 * @param valueB The right value to mix.
 * @param offset The progression offset to use.
 */
function fallbackMixer(
  valueA: ja.AnimationValue,
  valueB: ja.AnimationValue,
  offset: number
): ja.AnimationValue {
  // If either looks like a transform function, convert them.
  if (
    TRANSFORM_REGEX.test(valueA.toString()) ||
    TRANSFORM_REGEX.test(valueB.toString())
  ) {
    valueA = toMatrix(valueA);
    valueB = toMatrix(valueB);
  }
  // Parse both into expression lists.
  const expressionA = parseCssExpression(valueA);
  const expressionB = parseCssExpression(valueB);

  if (expressionA.length !== expressionB.length) {
    // If the two sets are not equal, the best thing we can do is interpolate.
    return offset < 0.5 ? valueB : valueA;
  }

  // Walk through the terms and decide whether it is a numeric mixer or a
  // discrete mixer.  Append these results together.
  const result: ja.AnimationValue[] = [];
  let remainingColorChannels = 0;
  const listLength = expressionA.length;
  for (let i = 0; i < listLength; i++) {
    const termA = expressionA[i];
    const termB = expressionB[i];

    // True if there is at least one term after this.
    const hasNextTerm = i < listLength - 1;

    // Test if this expression is part of an RGB css function.
    const isRgbFunction =
      (termA === "rgb" || termA === "rgba") &&
      hasNextTerm &&
      expressionA[i + 1] === "(";

    if (isRgbFunction) {
      // Wait for 3 color channels.
      remainingColorChannels = 3;
    }

    // If the next expression is a px value on a or b, we should lock to whole
    // numbers, otherwise lock to 4.
    const precision =
      hasNextTerm &&
      (expressionA[i + 1] === "px" || expressionB[i + 1] === "px")
        ? 1
        : 1000;

    if (typeof termA === "number" && typeof termB === "number") {
      if (remainingColorChannels) {
        // Mixing RGB channels properly requires squaring the terms, performing
        // interpolation, and then unsquaring it.
        result.push(
          Math.round(
            Math.sqrt(
              clamp((termA * termA + termB * termB) * offset, 0, 255 * 255)
            )
          )
        );
        remainingColorChannels--;
      } else {
        // Otherwise perform normal numeric interplation.
        result.push(
          Math.round((termA + termB) * offset * precision) / precision
        );
      }
    } else if (isUnit(termA) || isUnit(termB)) {
      result.push(unitMixer(termA, termB, offset));
    } else {
      result.push(offset < 0.5 ? termB : termA);
    }
  }
  return termsToString(result);
}

function getReaderWriter(
  target: ja.AnimationTarget,
  propertyName: string
): ReaderWriter {
  if (target instanceof Element) {
    if (propertyName.indexOf("--") === 0) {
      return cssVarReaderWriter;
    }
    if (htmlAttributeOnly.indexOf(propertyName) !== -1) {
      return attributeReaderWriter;
    }
    if (htmlPropOnly.indexOf(propertyName) !== -1) {
      return propertyReaderWriter;
    }
    return styleReaderWriter;
  }
  return propertyReaderWriter;
}

function getAllTerms(input: string, regex: RegExp): string[] {
  const terms: string[] = [];
  let result: RegExpExecArray | null;
  // tslint:disable-next-line:no-conditional-assignment
  while ((result = regex.exec(input))) {
    terms.push(result[1]);
  }
  return terms;
}

/**
 * Parse a string into a list of terms.
 * @param value the value to parse
 */
function parseCssExpression(input: ja.AnimationValue): ja.AnimationValue[] {
  input = input
    .toString()
    .replace(/#[a-f0-9]{3}([a-f0-9]{3})?/gi, hexToRgb)
    .trim();

  // tslint:disable-next-line:max-line-length
  const TERM_REGEX = /([a-z]{2,}[a-z0-9]+|[0-9\.\-]+[a-z%]*|[mhvlcsqtz\/,\(\)])/gi;

  // ([a-z][a-z0-9_-]*|#?\-?\d*\.?\d*[a-z%]*) <- everything but paths.
  return getAllTerms(input, TERM_REGEX).reduce<ja.AnimationValue[]>((c, n) => {
    const value = maybeParseNumber(n);
    if (value !== "") {
      c.push(value);
    }
    return c;
  }, []);
}

/**
 * Attempts to parse the a number from the string, otherwise just returns the
 * original string.
 * @param value The value to attempt to parse.
 */
function maybeParseNumber(value: string): ja.AnimationValue {
  value = value.trim();
  return !value ? "" : isFinite(+value) ? +value : value;
}

export function hexToRgb(stringValue: string) {
  const hex = stringValue.substring(1);
  const hexColor = parseInt(
    hex.length === 3
      ? hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
      : hex,
    16
  );
  const r = (hexColor >> 16) & 0xff;
  const g = (hexColor >> 8) & 0xff;
  const b = hexColor & 0xff;

  return `rgb(${r},${g},${b})`;
}

function termsToString(aTerms: ja.AnimationValue[]): string {
  const NUM = 1;
  const PUNCT = 2;
  const WORD = 3;

  let result = "";
  let lastType = 0;

  for (let i = 0, len = aTerms.length; i < len; i++) {
    const term = aTerms[i];
    const type =
      typeof term === "number" ? NUM : /^[\(\)\/,]$/i.test(term) ? PUNCT : WORD;
    if (i !== 0 && type === NUM && lastType !== PUNCT) {
      result += " ";
    }
    result += term;
    if (term === ")" && aTerms[i + 1] !== ")" && i !== len - 1) {
      result += " ";
    }
    lastType = type;
  }
  return result;
}
