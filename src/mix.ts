const END = 0;
const NUMBER = 1;
const UNIT = 2;
const KEYWORD = 3;
const FUNCTION = 4;
const DELIMITER = 5;
const PRECISION = 100000;

const DELIMITER_REGEX = /^\s*[\(\),\/\s]\s*/;
const HEX_REGEX = /^#[a-f\d]{3,6}/i;
const KEYWORD_REGEX = /^[a-z][a-z\d\-]*/i;
const NUMBER_REGEX = /^\-?\d*\.?\d+/;
const UNIT_REGEX = /^\-?\d*\.?\d+[a-z%]+/i;
const UNIT_EXTRACTOR_REGEX = /([a-z%]+)/i;
const PATH_COMMAND_REGEX = /^[mhvlcsqt]/i;
const PATH_REGEX = /^m[\s,]*-?\d*\.?\d+/i;
const SPACE_REGEX = /\s+/;

interface Mixer {
  isPath: boolean;
  current: string;
  pos: number;
  last: number;
  state: number;
  subject: string;
}

function startProcessing(ctx: Mixer, value: string) {
  ctx.isPath = PATH_REGEX.test(value);
  ctx.current = "";
  ctx.pos = 0;
  ctx.last = 0;
  ctx.state = NUMBER;
  ctx.subject = value;
}

function match(ctx: Mixer, regex: RegExp) {
  const match = regex.exec(ctx.subject.substring(ctx.pos));
  if (match) {
    ctx.current = match[0];
    ctx.last = ctx.pos;
    ctx.pos += ctx.current.length;
  }
  return match != null;
}

function nextToken(ctx: Mixer) {
  if (match(ctx, DELIMITER_REGEX)) {
    // Remove double spaces to make it consistent.
    ctx.current = ctx.current.replace(SPACE_REGEX, " ");
    return DELIMITER;
  }
  if (
    (ctx.isPath && match(ctx, PATH_COMMAND_REGEX)) ||
    match(ctx, KEYWORD_REGEX)
  ) {
    const isFunction =
      !ctx.isPath &&
      ctx.pos < ctx.subject.length - 1 &&
      ctx.subject[ctx.pos] === "(";

    if (isFunction) {
      if (ctx.current.toLowerCase() === "rgb") {
        const searchString = ctx.subject.substring(ctx.pos);
        const endOfString = searchString.indexOf(")");
        const terms = searchString.substring(1, endOfString);

        ctx.subject =
          ctx.subject.substring(0, ctx.pos + 1 + terms.length) +
          ",1" +
          ctx.subject.substring(ctx.pos + 1 + terms.length);
        ctx.current = "rgba";
      }
      return FUNCTION;
    }
    return KEYWORD;
  }
  if (!ctx.isPath && match(ctx, UNIT_REGEX)) {
    return UNIT;
  }
  if (match(ctx, NUMBER_REGEX)) {
    return NUMBER;
  }
  if (match(ctx, HEX_REGEX)) {
    // If the value was hex, replace it with RGB in the string and parse that.
    const hexValue = ctx.subject.substring(ctx.last + 1, ctx.pos);
    ctx.subject =
      ctx.subject.substring(0, ctx.last) +
      hexToRgb(hexValue) +
      ctx.subject.substring(ctx.pos);

    // Reset the position and chain another call to nextToken.
    ctx.pos = ctx.last;
    return nextToken(ctx);
  }
  return END;
}

function hexToRgb(hex: string) {
  // Parse 3 or 6 hex to an integer using 16 base.
  const h = parseInt(
    hex.length === 3
      ? hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
      : hex,
    16
  );
  const r = (h >> 16) & 0xff;
  const g = (h >> 8) & 0xff;
  const b = h & 0xff;

  return `rgba(${r},${g},${b},1)`;
}

const ctx1 = {} as Mixer;
const ctx2 = {} as Mixer;

/**
 * @param {string} valueA
 * @param {string} valueB
 * @param {number} offset
 */
export function mix(valueA: string, valueB: string, offset: number): string {
  // Reuse contexts to process this request.
  startProcessing(ctx1, valueA);
  startProcessing(ctx2, valueB);

  let output = "";
  let remainingSquaredChannels = 0;
  let token1: number;
  let token2: number;

  while (true) {
    token1 = nextToken(ctx1);
    token2 = nextToken(ctx2);
    if (!token1 || !token2) {
      break;
    }
    const term1 = ctx1.current;
    const term2 = ctx2.current;

    if (token1 === NUMBER && token2 === NUMBER) {
      let numericTerm: number;
      if (remainingSquaredChannels) {
        numericTerm = Math.round(
          Math.sqrt(
            Math.min(
              Math.max(0, (+term1 * +term1 + +term2 * +term2) * offset),
              255 * 255
            )
          )
        );
        remainingSquaredChannels--;
      } else {
        numericTerm =
          Math.round((+term1 + +term2) * offset * PRECISION) / PRECISION;
      }
      output += numericTerm;
    } else if (token1 === UNIT || token2 === UNIT) {
      const unitMatch = UNIT_EXTRACTOR_REGEX.exec(
        token1 === UNIT ? term1 : term2
      )!;
      const unit = unitMatch[1];
      const precision = unit === "px" ? 1 : PRECISION;
      const unitNumber1 = parseFloat(term1);
      const unitNumber2 = parseFloat(term2);

      // Round to the nearest whole number or 6th decimal.
      const numericTerm =
        Math.round((unitNumber1 + unitNumber2) * offset * precision) /
        precision;

      // The parseFloat should remove px & % automatically
      output += numericTerm + unit;
    } else if (token1 === FUNCTION && token2 === FUNCTION) {
      const term = offset < 0.5 ? term1 : term2;
      if (term === "rgb" || term === "rgba") {
        remainingSquaredChannels = 3;
      }
      output += term;
    } else {
      output += offset < 0.5 ? term1 : term2;
    }
  }

  return output;
}
