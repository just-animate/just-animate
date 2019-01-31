export const SYNTAX_REGEX = /^\s*[\(\),\/\s]\s*/;
export const PAREN_OPEN_REGEX = /^\(/;
export const PAREN_CLOSE_REGEX = /^\)/;
export const HEX_REGEX = /^#[a-f\d]{3,6}/i;
export const STRING_REGEX = /^[a-z][a-z\d\-]*/i;
export const NUMBER_REGEX = /^\-?\d*\.?\d+/;
export const UNIT_REGEX = /^\-?\d*\.?\d+[a-z%]+/i;
export const PATH_COMMAND_REGEX = /^[mhvlcsqt]/i;

export interface ParserContext {
  match: string;
  pos: number;
  last: number;
  state: number;
  pattern: string;
}

/** A bitflag token for a number. */
export const NUMBER = 1;
/** A bitflag token for expression delimiter. */
export const SYNTAX = 2;
/** A bitflag token for a keyword. */
export const STRING = 4;
/** A bitflag token for a unit. */
export const UNIT = NUMBER | STRING;
/** A bitflag token for a ( */
export const PAREN_OPEN = 8 | SYNTAX;
/** A bitflag token for a ) which is also considered delimiter. */
export const PAREN_CLOSE = 16 | SYNTAX;
/** A bitflag token for a function, which is composed of a keyword and a (. */
export const FUNCTION = 32;

export function clearContext(ctx: ParserContext, value: string) {
  ctx.match = "";
  ctx.pos = ctx.last = ctx.state = 0;
  ctx.pattern = value;
}

export function match(ctx: ParserContext, regex: RegExp) {
  const match = regex.exec(ctx.pattern.substring(ctx.pos));
  if (match) {
    ctx.match = match[0];
    ctx.last = ctx.pos;
    ctx.pos += ctx.match.length;
  }
  return match != null;
}
