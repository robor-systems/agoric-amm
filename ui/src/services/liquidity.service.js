import { E } from '@agoric/captp';
import { makeRatio } from '@agoric/zoe/src/contractSupport';

export const requestRatio = async (brand, makeRate, centralBrand, ammAPI) => {
  if (brand === centralBrand) {
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

export const getUserLiquidity = async (ammAPI, purses) => {
  let interArr = [];
  const promises = [];
  /* eslint-disable no-await-in-loop */
  purses.forEach(purse => {
    promises.push(E(ammAPI).getLiquiditySupply(purse.brand));
  });

  await Promise.allSettled(promises)
    .then(results => {
      results = results.map((item, index) => {
        return { ...item, brand: purses[index].brand };
      });
      interArr = results
        .filter(item => item.status === 'fulfilled')
        .map(item => {
          return { value: item.value, brand: item.brand };
        });
    })
    .catch(error => {
      console.error(error);
    });
  return interArr;
};

export const getPoolAllocation = async (ammAPI, purses) => {
  let interArr = [];
  const promises = [];

  /* eslint-disable no-await-in-loop */
  try {
    purses.forEach(purse => {
      promises.push(E(ammAPI).getPoolAllocation(purse.brand));
    });
  } catch (error) {
    console.error(error);
  }

  await Promise.allSettled(promises)
    .then(results => {
      results = results.map((item, index) => {
        console.log(item);
        return { ...item, brand: purses[index].brand };
      });
      interArr = results
        .filter(item => item.status === 'fulfilled')
        .map(item => {
          return item.value;
        });
    })
    .catch(error => {
      console.error(error);
    });

  return interArr;
};
