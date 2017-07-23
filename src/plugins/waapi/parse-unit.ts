
import { isDefined } from '../../utils/type';
import { _ } from '../../utils/resources';

const measureExpression = /^([+|-]*[.]*?[\d]+)([a-z]+)*$/i

export interface Unit {
  value: number | undefined,
  unit: string
}

/**
 * Parses a string or number and returns the unit and numeric value
 */
export function parseUnit(val: string | number): Unit {
  const output: Unit = {
    unit: _,
    value: _
  }

  if (!isDefined(val)) {
    return output
  }
  if (Number(val)) {
    output.value = +val;
    return output
  }

  const [/* match */, startString, unitTypeString] = measureExpression.exec(val as string) as RegExpExecArray

  output.unit = unitTypeString || undefined;
  output.value = startString ? parseFloat(startString) : undefined;
  return output
}
