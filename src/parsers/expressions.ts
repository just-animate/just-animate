import {
  ParserContext,
  match,
  FUNCTION,
  STRING,
  UNIT,
  NUMBER,
  PAREN_CLOSE,
  PAREN_CLOSE_REGEX,
  PAREN_OPEN_REGEX,
  PAREN_OPEN,
  SYNTAX_REGEX,
  SYNTAX
} from "./common";

import {
  PATH_COMMAND_REGEX,
  STRING_REGEX,
  UNIT_REGEX,
  NUMBER_REGEX,
  HEX_REGEX
} from "./common";

import { hexToRgb } from "./colors";

export interface MixerParserContext extends ParserContext {
  isPath: boolean;
}

export function nextToken(ctx: MixerParserContext): number | undefined {
  if (match(ctx, PAREN_CLOSE_REGEX)) {
    return PAREN_CLOSE;
  }
  if (match(ctx, PAREN_OPEN_REGEX)) {
    return PAREN_OPEN;
  }
  if (match(ctx, SYNTAX_REGEX)) {
    return SYNTAX;
  }
  if (
    (ctx.isPath && match(ctx, PATH_COMMAND_REGEX)) ||
    match(ctx, STRING_REGEX)
  ) {
    const isFunction =
      !ctx.isPath &&
      ctx.pos < ctx.pattern.length - 1 &&
      ctx.pattern[ctx.pos] === "(";

    if (!isFunction) {
      return STRING;
    }
    if (ctx.match.toLowerCase() === "rgb") {
      const searchString = ctx.pattern.substring(ctx.pos);
      const endOfString = searchString.indexOf(")");
      const terms = searchString.substring(1, endOfString);

      ctx.pattern =
        ctx.pattern.substring(0, ctx.pos + 1 + terms.length) +
        ",1" +
        ctx.pattern.substring(ctx.pos + 1 + terms.length);
      ctx.match = "rgba";
    }
    return FUNCTION;
  }
  if (!ctx.isPath && match(ctx, UNIT_REGEX)) {
    return UNIT;
  }
  if (match(ctx, NUMBER_REGEX)) {
    return NUMBER;
  }
  if (match(ctx, HEX_REGEX)) {
    // If the value was hex, replace it with RGB in the string and parse that.
    const hexValue = ctx.pattern.substring(ctx.last + 1, ctx.pos);
    ctx.pattern =
      ctx.pattern.substring(0, ctx.last) +
      hexToRgb(hexValue) +
      ctx.pattern.substring(ctx.pos);

    // Reset the position and chain another call to nextToken.
    ctx.pos = ctx.last;
    return nextToken(ctx);
  }
}
