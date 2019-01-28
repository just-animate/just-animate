import { ja } from "../types";
import { isNumeric } from "../utils/numbers";
import {
  clearContext,
  NUMBER,
  UNIT,
  FUNCTION,
  ParserContext
} from "../parsers/common";
import {
  MixerParserContext,
  nextToken as nextExp
} from "../parsers/expressions";

import { nextToken as nextTransform } from "../parsers/transforms";

const UNIT_EXTRACTOR_REGEX = /([a-z%]+)/i;
const PATH_REGEX = /^m[\s,]*-?\d*\.?\d+/i;
const TRANSFORM_REGEX =
  // Match on all transform functions.
  /(perspective|matrix(3d)?|skew[xy]?|(translate|scale|rotate)([xyz]|3d)?)\(/i;

/**
 * This mixer attempts to automatically parse CSS expressions from each value
 * and then create an interpolated value from it.
 * @param valueA The left value to mix.
 * @param valueB The right value to mix.
 * @param offset The progression offset to use.
 */
export function autoMix(
  valueA: ja.AnimationValue,
  valueB: ja.AnimationValue,
  offset: number
): ja.AnimationValue {
  if (isNumeric(valueA) && isNumeric(valueB)) {
    return mixNumber(+valueA, +valueB, offset);
  }
  // If the right is a transform list and the left is not, create net-0
  // transform list on the left that mirrors the right. This allows for tweening
  // values like none or empty string for the initial keyframe.
  if (
    TRANSFORM_REGEX.test(valueB.toString()) &&
    !TRANSFORM_REGEX.test(valueA.toString())
  ) {
    valueA = negateTransformList(valueB.toString());
  }
  // If value A or B is null or undefined, swap to empty string.
  if (valueA == null) {
    valueA = "";
  }
  if (valueB == null) {
    valueB = "";
  }
  return mix(valueA.toString(), valueB.toString(), offset);
}

const ctxTransform = {} as ParserContext;

function negateTransformList(value: string) {
  clearContext(ctxTransform, value);

  let token: number | undefined;
  let fn: string | undefined;
  let termCount = 0;
  let output = "";
  while (true) {
    token = nextTransform(ctxTransform);
    if (!token) {
      // Exit when there is nothing left to do.
      break;
    }
    if (token === FUNCTION) {
      // Use functions to start over counting numbers/units.
      fn = ctxTransform.match.toLowerCase();
      termCount = 0;
    }
    if (token !== UNIT && token !== NUMBER) {
      // If a number or unit, pass content through.
      output += ctxTransform.match;
      continue;
    }

    if (fn === "matrix") {
      // Scale defaults to 1 (position 0 and 3)
      output += termCount % 3 ? "0" : "1";
    } else if (fn === "matrix3d") {
      // Scale defaults to 1.
      // Example net-0 3d matrix:
      // 1 0 0 0
      // 0 1 0 0
      // 0 0 1 0
      // 0 0 0 1
      output += termCount % 5 ? "0" : "1";
    } else if (/scale([xyz]|3d)?/i.test(fn!)) {
      output += "1";
    } else {
      output += "0";
    }

    termCount++;
  }
  return output;
}

const ctxLeft = {} as MixerParserContext;
const ctxRight = {} as MixerParserContext;

/**
 * Mixes a css or path expression.
 * @param {string} left
 * @param {string} right
 * @param {number} progress
 */
function mix(left: string, right: string, progress: number): string {
  // Reuse contexts to process this request.
  clearContext(ctxLeft, left);
  clearContext(ctxRight, right);

  // Identify if these are paths.
  ctxLeft.isPath = PATH_REGEX.test(left);
  ctxRight.isPath = PATH_REGEX.test(right);

  let output = "";
  let rgbChannelsRemaining = 0;
  let tokenLeft: number | undefined;
  let tokenRight: number | undefined;

  while (true) {
    tokenLeft = nextExp(ctxLeft);
    tokenRight = nextExp(ctxRight);
    if (!tokenLeft || !tokenRight) {
      break;
    }
    const termLeft = ctxLeft.match;
    const termRight = ctxRight.match;

    if (tokenLeft === NUMBER && tokenRight === NUMBER) {
      let numericTerm: number;
      if (rgbChannelsRemaining) {
        numericTerm = mixRgbChannel(+termLeft, +termRight, progress);
        rgbChannelsRemaining--;
      } else {
        numericTerm = mixNumber(+termLeft, +termRight, progress);
      }
      output += numericTerm;
    } else if (tokenLeft === UNIT || tokenRight === UNIT) {
      const unitMatch = UNIT_EXTRACTOR_REGEX.exec(
        tokenLeft === UNIT ? termLeft : termRight
      )!;
      const unit = unitMatch[1];
      const isWholeNumber = unit === "px";
      const unitLeft = parseFloat(termLeft);
      const unitRight = parseFloat(termRight);

      const numericTerm = mixNumber(
        unitLeft,
        unitRight,
        progress,
        isWholeNumber
      );

      // The parseFloat should remove px & % automatically
      output += numericTerm + unit;
    } else {
      const term = progress < 0.5 ? termLeft : termRight;
      const isRgbFunction =
        tokenLeft === FUNCTION &&
        tokenRight === FUNCTION &&
        (term === "rgb" || term === "rgba");

      if (isRgbFunction) {
        rgbChannelsRemaining = 3;
      }

      output += term;
    }
  }

  return output;
}

/**
 * Mixes two numeric terms.
 * @param left The left side of the mix operation.
 * @param right The right side of the mix operation.
 * @param progress The progression between left and right.
 * @param precision The precision expressed a multiple of 10. Ex: 3 precision
 *    would be 100.
 */
function mixNumber(
  left: number,
  right: number,
  progress: number,
  isWholeNumber?: boolean
) {
  const n = left + (right - left) * progress;
  return isWholeNumber ? Math.round(n) : n;
}

/**
 * Mixes two RGB channels. In order to match CSS color interpolation, the terms
 * need to first be squared, then multiplied by the progress, then finally,
 * unsquared.
 * @param left The left side of the mix operation.
 * @param right The right side of the mix operation.
 * @param progress The progression between left and right.
 */
function mixRgbChannel(left: number, right: number, progress: number): number {
  return Math.round(
    Math.sqrt(
      Math.min(Math.max(0, (left * left + right * right) * progress), 255 * 255)
    )
  );
}
