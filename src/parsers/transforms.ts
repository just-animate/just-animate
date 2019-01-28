import {
  ParserContext,
  match,
  DELIMITER,
  NUMBER,
  UNIT,
  FUNCTION
} from "./common";

import {
  NUMBER_REGEX,
  DELIMITER_REGEX,
  UNIT_REGEX,
  KEYWORD_REGEX
} from "./common";

export function nextToken(ctx: ParserContext): number | undefined {
  if (match(ctx, DELIMITER_REGEX)) {
    return DELIMITER;
  }
  if (match(ctx, NUMBER_REGEX)) {
    return NUMBER;
  }
  if (match(ctx, UNIT_REGEX)) {
    return UNIT;
  }
  if (match(ctx, KEYWORD_REGEX)) {
    return FUNCTION;
  }
}
