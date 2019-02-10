import { cachefn } from '../services/cachefn';

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
const cachedHexToRgb = cachefn(hexToRgb);
export { cachedHexToRgb as hexToRgb };
