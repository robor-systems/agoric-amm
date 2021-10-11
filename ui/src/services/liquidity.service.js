import { E } from '@agoric/captp';
import runLogo from 'assets/crypto-icons/ripple-logo.png';
import { result } from 'lodash';

export const centralAsset = {
  code: 'RUN',
  name: 'Run',
  image: runLogo,
  id: 'e7262493-243b-4193-b3d7-9cdi2rierie23sdf0d13c2a60',
  balance: 22.5,
  balanceUSD: 50.75,
  purses: [
    {
      name: 'Cosmos 1',
      balanceUSD: 12,
      balance: 5,
      id: 'e7262493-243bjvs3932ke32438923b3d7-9cd0d13c2a60',
    },
    {
      name: 'Cosmos 2',
      balance: 10,
      balanceUSD: 33,
      id: 'e7262493-243bjvs3932-32498-b3d7-9cd0d13c2a60-323i233',
    },
    // {
    //   name: 'Cosmos 3',
    //   balance: 7.5,
    //   balanceUSD: 22,
    //   id: 'e7262493-23bj2-32498-b3d7-9cd0d13c2a60',
    // },
  ],
};

export const getLiquiditySupply = async (ammAPI, purses) => {
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
