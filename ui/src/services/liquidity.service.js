import { E } from '@agoric/captp';
import { AmountMath, AssetKind, makeIssuerKit } from '@agoric/ertp';
import { makeRatio } from '@agoric/zoe/src/contractSupport';
import { uniqueId } from 'lodash';
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

export const getUserLiquidityService = async (ammAPI, purses) => {
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
  const liquidity = alloc.Liquidity;
  console.log(alloc);

  if (!liquidity) {
    return Error('Liquidity brand not found');
  }

  const liquidityAmount = AmountMath.make(liquidity.brand, centralAmount.value);

  const {
    AMM_INSTALLATION_BOARD_ID,
    AMM_INSTANCE_BOARD_ID,
    CONTRACT_NAME,
  } = dappConfig;
  let liquidityPurse = purses.find(purse => purse.brand === liquidity.brand);
  console.log('PURSES', purses);
  console.log('liquidity brand: ', liquidity.brand);
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

  console.log(
    'Adding liquidity, here are the values:',
    centralAmount,
    centralValuePurse,
    secondaryAmount,
    secondaryValuePurse,
    ammAPI,
    walletP,
    liquidityAmount,
  );

  const id = `${Date.now()}`;

  const invitation = await E(ammAPI).makeAddLiquidityInvitation();
  // const zoe = await E(walletP).getZoe();

  // *******************************************************************
  // RIGHT NOW IT WILL CRASH SAYING WE CANT FIND WITHDRAW METHOD
  // *******************************************************************

  // const walletAdmin = await E(zoe).getAdminFacet();

  // const centralPurse = await E(walletAdmin).getPurse(
  //   centralValuePurse.pursePetname,
  // );
  const centralPayment = await E(centralValuePurse).withdraw(centralAmount);

  // const secondaryPurse = await E(walletAdmin).getPurse(
  //   secondaryValuePurse.pursePetname,
  // );
  const secondaryPayment = await E(secondaryValuePurse).withdraw(
    secondaryAmount,
  );

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
          value: secondaryAmount.value,
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
    payments: {
      centralPayment,
      secondaryPayment,
    },
  };

  console.info('ADD LIQUIDITY CONFIG: ', offerConfig);

  // try {
  //   await E(walletP).addOffer(offerConfig);
  // } catch (error) {
  //   console.error(error);
  // }

  return { message: 'Offer successfully sent' };
};
