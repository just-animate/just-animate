import { ja } from "../types";
import { readAttribute, writeAttribute } from "./attribute";
import { readCssVar, writeCssVar } from "./cssvar";
import { readStyle, writeStyle } from "./style";
import { readProperty, writeProperty } from "./property";
import { autoMix } from "./mix";

export interface TargetMixer {
  (
    left: ja.AnimationValue,
    right: ja.AnimationValue,
    offset: number
  ): ja.AnimationValue;
}

export interface TargetReader {
  (target: {}, key: string): ja.AnimationValue;
}

export interface TargetWriter {
  (target: {}, key: string, value: ja.AnimationValue): void;
}

export type TargetType =
  | typeof PROPERTY
  | typeof CSS_VAR
  | typeof ATTRIBUTE
  | typeof STYLE;

export const PROPERTY = 0,
  CSS_VAR = 1,
  ATTRIBUTE = 2,
  STYLE = 3;

const htmlAttributeOnly = ["viewBox"];
const htmlPropOnly = ["innerHTML", "textContent"];

export function detectTargetType(
  target: ja.AnimationTarget,
  propertyName: string
): TargetType {
  const isProbablyHTMLElement =
    typeof (target as HTMLElement).tagName === "string" &&
    (target as HTMLElement).style;

  if (!isProbablyHTMLElement) {
    return PROPERTY;
  }

  if (propertyName.indexOf("--") === 0) {
    return CSS_VAR;
  }
  if (htmlAttributeOnly.indexOf(propertyName) !== -1) {
    return ATTRIBUTE;
  }
  if (htmlPropOnly.indexOf(propertyName) !== -1) {
    return PROPERTY;
  }
  return STYLE;
}

/**
 * Returns a reader for the given targetType.
 */
export function getReader(targetType: TargetType): TargetReader {
  if (targetType === ATTRIBUTE) {
    return readAttribute;
  }
  if (targetType === CSS_VAR) {
    return readCssVar;
  }
  if (targetType === STYLE) {
    return readStyle;
  }
  return readProperty;
}

/**
 * Returns a writer for the given targetType.
 */
export function getWriter(targetType: TargetType): TargetWriter {
  if (targetType === ATTRIBUTE) {
    return writeAttribute;
  }
  if (targetType === CSS_VAR) {
    return writeCssVar;
  }
  if (targetType === STYLE) {
    return writeStyle;
  }
  return writeProperty;
}

/**
 * Returns a mixers for the given targetType.
 */
export function getMixer(_targetType: TargetType): TargetMixer {
  return autoMix;
}
