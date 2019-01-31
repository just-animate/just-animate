import { inOut } from "./inOut";
import { ja } from "../types";
import { mirror } from "./mirror";

export function bounce(type?: ja.EaseTypes, factor?: number) {
  // Guard if factor comes in as a string.
  factor = +(factor || factor === 0 ? factor : 7.5625);
  return inOut(
    mirror(o => {
      if (o < 0.36363636) {
        // (-1.0/2.75) to (1.0/2.75), centered on (0.0/2.75)
        return factor! * o * o;
      }
      if (o < 0.72727273) {
        // (1.0/2.75) to (2.0/2.75), centered on (1.5/2.75)
        return factor! * (o -= 0.545455) * o + 0.75;
      }
      if (o < 0.90909091) {
        // (2.0/2.75) to (2.5/2.75), centered on (2.25/2.75)
        return factor! * (o -= 0.818182) * o + 0.9375;
      }
      // (2.5/2.75) to (2.75/2.75), centered on (2.625/2.75)
      return factor! * (o -= 0.954545) * o + 0.984375;
    }),
    type
  );
}
