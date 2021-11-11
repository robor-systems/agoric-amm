import { E } from '@agoric/captp';
import { AmountMath } from '@agoric/ertp';
import {
  calcLiqValueToMint,
  calcSecondaryRequired,
  makeRatio,
} from '@agoric/zoe/src/contractSupport';
import { dappConfig } from '../utils/config.js';

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

export const getUserLiquidityService = async assets => {
  console.log(assets);
  // let interArr = [];
  // const promises = [];
  // /* eslint-disable no-await-in-loop */
  // purses.forEach(purse => {
  //   promises.push(E(ammAPI).getLiquiditySupply(purse.brand));
  // });

  // await Promise.allSettled(promises)
  //   .then(results => {
  //     results = results.map((item, index) => {
  //       return { ...item, brand: purses[index].brand };
  //     });
  //     interArr = results
  //       .filter(item => item.status === 'fulfilled')
  //       .map(item => {
  //         return { value: item.value, brand: item.brand };
  //       });
  //   })
  //   .catch(error => {
  //     console.error(error);
  //   });
  // return interArr;
};

export const getPoolAllocationService = async ammAPI => {
  let interArr = [];
  const promises = [];
  let allPoolBrands;

  try {
    allPoolBrands = await E(ammAPI).getAllPoolBrands();
    console.log('ALL POOL BRANDS: ', allPoolBrands);
  } catch (error) {
    console.error(error);
  }

  /* eslint-disable no-await-in-loop */
  try {
    allPoolBrands.forEach(brand => {
      promises.push(E(ammAPI).getPoolAllocation(brand));
    });
  } catch (error) {
    console.error(error);
  }

  await Promise.allSettled(promises)
    .then(results => {
      results = results.map((item, index) => {
        console.log(item);
        return { ...item, brand: allPoolBrands[index] };
      });
      interArr = results
        .filter(item => item.status === 'fulfilled')
        .map(item => {
          console.log('HERE ARE THE RESULTS FROM THE PROMISES: ', item);
          return item.value;
        });
    })
    .catch(error => {
      console.error(error);
    });

  return interArr;
};

const createNewPurse = async (
  liquidityBrand,
  walletP,
  instanceID,
  contractName,
) => {
  console.log('CREATING PURSE');
  const board = await E(walletP).getBoard();
  const zoe = await E(walletP).getZoe();
  const instance = await E(board).getValue(instanceID);
  const issuers = await E(zoe).getIssuers(instance);
  const liquidityBrandName = await E(liquidityBrand).getAllegedName();
  console.log("HERE's ISSUERS: ", issuers);

  const liquidityIssuer = issuers[liquidityBrandName];

  if (!liquidityIssuer) {
    throw Error('Liquidity issuer not found in AMM');
  }
  const liquidityId = await E(board).getId(liquidityIssuer);
  await E(walletP).suggestIssuer(liquidityBrandName, liquidityId);

  // purseName of newly created purse will come out as array
  const newName = [];
  newName.push(contractName);
  newName.push(liquidityBrandName);

  return newName;
};

export const addLiquidityService = async (
  centralAmount,
  centralValuePurse,
  secondaryAmount,
  secondaryValuePurse,
  ammAPI,
  walletP,
  purses,
) => {
  const alloc = await E(ammAPI).getPoolAllocation(secondaryValuePurse.brand);
  console.log(alloc);

  const centralPoolValue = alloc.Central.value;
  const secondaryPoolValue = alloc.Secondary.value;

  const secondaryValue = calcSecondaryRequired(
    centralAmount.value,
    centralPoolValue,
    secondaryPoolValue,
    secondaryAmount.value,
  );

  console.log(
    'Secondary Value: ',
    secondaryAmount.value,
    'New value: ',
    secondaryValue,
  );

  const liquidity = alloc.Liquidity;
  if (!liquidity) {
    return Error('Liquidity brand not found');
  }

  const liquidityValue = calcLiqValueToMint(
    liquidity.value,
    centralAmount.value,
    centralPoolValue,
  );

  console.log('NEW LIQUIDITY VALUE: ', liquidityValue);

  const liquidityAmount = AmountMath.make(liquidity.brand, liquidityValue);

  const {
    AMM_INSTALLATION_BOARD_ID,
    AMM_INSTANCE_BOARD_ID,
    CONTRACT_NAME,
  } = dappConfig;

  let liquidityPurse = purses.find(purse => purse.brand === liquidity.brand);

  console.log('liquidity brand: ', liquidity.brand);
  console.log('PURSES', purses);
  console.log(liquidityPurse);

  if (liquidityPurse) {
    liquidityPurse = liquidityPurse.pursePetname;
  } else {
    liquidityPurse = await createNewPurse(
      liquidity.brand,
      walletP,
      AMM_INSTANCE_BOARD_ID,
      CONTRACT_NAME,
    );
  }

  console.log('LIQUIDITY PURSE', liquidityPurse);

  const id = `${Date.now()}`;

  const invitation = await E(ammAPI).makeAddLiquidityInvitation();

  const offerConfig = {
    id,
    invitation,
    installationHandleBoardId: AMM_INSTALLATION_BOARD_ID,
    instanceHandleBoardId: AMM_INSTANCE_BOARD_ID,
    proposalTemplate: {
      give: {
        Secondary: {
          // The pursePetname identifies which purse we want to use
          pursePetname: secondaryValuePurse.pursePetname,
          value: secondaryValue,
        },
        Central: {
          // The pursePetname identifies which purse we want to use
          pursePetname: centralValuePurse.pursePetname,
          value: centralAmount.value,
        },
      },
      want: {
        Liquidity: {
          // The pursePetname identifies which purse we want to use
          pursePetname: liquidityPurse,
          value: liquidityAmount.value,
        },
      },
    },
  };
  console.info('ADD LIQUIDITY CONFIG: ', offerConfig);

  try {
    await E(walletP).addOffer(offerConfig);
  } catch (error) {
    console.error(error);
  }

  return { message: 'Offer successfully sent' };
};
