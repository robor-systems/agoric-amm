import { E } from '@agoric/captp';
import { makeRatio } from '@agoric/zoe/src/contractSupport';

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
