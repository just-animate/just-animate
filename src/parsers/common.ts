export const DELIMITER_REGEX = /^\s*[\(\),\/\s]\s*/;
export const HEX_REGEX = /^#[a-f\d]{3,6}/i;
export const KEYWORD_REGEX = /^[a-z][a-z\d\-]*/i;
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

export const NUMBER = 1,
  UNIT = 2,
  KEYWORD = 3,
  FUNCTION = 4,
  DELIMITER = 5;

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
