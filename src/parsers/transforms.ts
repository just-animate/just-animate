import { ParserContext, match, SYNTAX, NUMBER, UNIT, FUNCTION } from "./common";

import { NUMBER_REGEX, SYNTAX_REGEX, UNIT_REGEX, STRING_REGEX } from "./common";

export function nextToken(ctx: ParserContext): number | undefined {
  if (match(ctx, SYNTAX_REGEX)) {
    return SYNTAX;
  }
  if (match(ctx, NUMBER_REGEX)) {
    return NUMBER;
  }
  if (match(ctx, UNIT_REGEX)) {
    return UNIT;
  }
  if (match(ctx, STRING_REGEX)) {
    return FUNCTION;
  }
}
