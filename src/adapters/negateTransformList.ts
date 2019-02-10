import {
  clearContext,
  ParserContext,
  FUNCTION,
  UNIT,
  NUMBER,
} from '../parsers/common';
import { nextToken } from '../parsers/transforms';
import { cachefn } from '../services/cachefn';

const ctxTransform = {} as ParserContext;

function negateTransformList(value: string) {
  clearContext(ctxTransform, value);

  let token: number | undefined;
  let fn: string | undefined;
  let termCount = 0;
  let output = '';
  while (true) {
    token = nextToken(ctxTransform);
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

    if (fn === 'matrix') {
      // Scale defaults to 1 (position 0 and 3)
      output += termCount % 3 ? '0' : '1';
    } else if (fn === 'matrix3d') {
      // Scale defaults to 1.
      // Example net-0 3d matrix:
      // 1 0 0 0
      // 0 1 0 0
      // 0 0 1 0
      // 0 0 0 1
      output += termCount % 5 ? '0' : '1';
    } else if (/scale([xyz]|3d)?/i.test(fn!)) {
      output += '1';
    } else {
      output += '0';
    }

    termCount++;
  }
  return output;
}

const cachedNegateTransformList = cachefn(negateTransformList);
export { cachedNegateTransformList as negateTransformList };
