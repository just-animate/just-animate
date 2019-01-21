import { ja } from "./types";
import { isNumeric, clamp } from "./numbers";
import { mix } from "./mix";

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
  if (isNumeric(valueA) && isNumeric(valueB)) {
    return (+valueA + +valueB) * offset;
  }
  // If either looks like a transform function, convert them.
  if (
    TRANSFORM_REGEX.test(valueA.toString()) ||
    TRANSFORM_REGEX.test(valueB.toString())
  ) {
    valueA = toMatrix(valueA);
    valueB = toMatrix(valueB);
  }
  return mix(valueA.toString(), valueB.toString(), offset);
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
