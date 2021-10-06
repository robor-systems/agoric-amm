import { E } from '@agoric/captp';
import { makeRatio } from '@agoric/zoe/src/contractSupport';

/**
 * The `marketRate` is the ratio between the input asset
 * and the output asset. It is computed by getting the market
 * price for each pool, and composing them. If one of the
 * selected assets is the central token, that "poolRate"
 * is just 1:1 (centralOnlyRate, above).
 *
 * Becuase the ratios are queries async, the state for
 * them starts as `{ brand, amount: null }`. The brand is
 * used to check at `set` time that the brand has not changed;
 * e.g., because the user selected a purse with a different
 * brand.
 *
 * The input `poolRate` is `RUN/inputBrand` and the output
 * `poolRate` is `outputBrand/RUN`.
 */

export const requestRatio = async (brand, makeRate, centralBrand, ammAPI) => {
  if (brand === centralBrand) {
    console.log('got central asset');
    // See marketPrice comment above
    return {
      brand: centralBrand,
      ratio: makeRatio(100000000n, centralBrand, 100000000n, centralBrand),
    };
  }
  let poolRate = { brand, ratio: null };
  const alloc = await E(ammAPI).getPoolAllocation(brand);

  // only update if the brand hasn't changed
  const ratio = makeRate(alloc.Central, alloc.Secondary);
  console.log(`Pool allocation`, alloc, ratio);

  poolRate = poolRate.brand === brand ? { brand, ratio } : poolRate;
  // poolRate = poolRate(q => (q.brand === brand ? { brand, ratio } : q));
  return poolRate;
};
