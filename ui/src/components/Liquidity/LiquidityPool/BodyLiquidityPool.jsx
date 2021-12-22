import PoolContext from 'context/PoolContext';
import Loader from 'react-loader-spinner';
import { useApplicationContext } from 'context/Application';
import React, { useState, useEffect, useContext } from 'react';
import { v4 } from 'uuid';

import { getInfoForBrand } from 'utils/helpers';
import { stringifyNat } from '@agoric/ui-components/dist/display/natValue/stringifyNat';
import { motion } from 'framer-motion';

import HeaderLiquidityPool from './HeaderLiquidityPool';
import ItemLiquidityPool from './ItemLiquidityPool';

// decimal places to show in input
const PLACES_TO_SHOW = 2;
const ALL = 'ALL';
const YOURS = 'YOURS';

const BodyLiquidityPool = props => {
  const [loadUserLiquidityPools, setLoadUserLiquidityPools] = useState(false);
  const [pool] = useContext(PoolContext);
  const [updatedPool, setUpdatedPool] = useState([]);
  const [userPool, setUserPool] = useState([]);

  // get state
  const { state } = useApplicationContext();
  const { brandToInfo } = state;

  useEffect(() => {
    const updatePools = () => {
      // console.log('Update Pool Function Running');
      const newPool = pool?.allocations?.map(item => {
        const central = item.Central;
        const secondary = item.Secondary;

        const centralInfo = getInfoForBrand(brandToInfo, central.brand);
        const secondaryInfo = getInfoForBrand(brandToInfo, secondary.brand);

        const centralValString = stringifyNat(
          central.value,
          centralInfo.decimalPlaces,
          PLACES_TO_SHOW,
        );

        const secondaryValString = stringifyNat(
          secondary.value,
          secondaryInfo.decimalPlaces,
          PLACES_TO_SHOW,
        );
        return {
          Central: { info: centralInfo, value: centralValString },
          Secondary: { info: secondaryInfo, value: secondaryValString },
        };
      });

      setUpdatedPool(newPool);
      // console.log('Update Pool Function Complete');
    };

    pool.allocations && updatePools();
  }, []);

  useEffect(() => {
    // console.log('Running the useEffect');
    const updateUserPools = () => {
      // console.log('User Pool Function Running');
      const { userPairs } = pool;
      // console.log('Getting user pools');
      // console.log(userPairs);

      const newUserPairs = userPairs?.map(pair => {
        const central = pair.Central;
        const secondary = pair.Secondary;

        const centralInfo = getInfoForBrand(brandToInfo, central.brand);
        const secondaryInfo = getInfoForBrand(brandToInfo, secondary.brand);

        const centralValString = stringifyNat(
          central.value,
          centralInfo.decimalPlaces,
          PLACES_TO_SHOW,
        );

        const secondaryValString = stringifyNat(
          secondary.value,
          secondaryInfo.decimalPlaces,
          PLACES_TO_SHOW,
        );
        // console.log('userPool length : ', userPairs.length);
        return {
          Central: { info: centralInfo, value: centralValString },
          Secondary: { info: secondaryInfo, value: secondaryValString },
          User: {
            share: pair.percentShare,
            brand: pair.brand,
            userLiquidityNAT: pair.userLiquidityNAT,
            totaLiquidity: pair.value,
          },
        };
      });
      setUserPool(newUserPairs);
      // console.log('User Pool Function Complete');
    };
    pool.userPairs && updateUserPools();
  }, []);

  useEffect(() => {
    console.log(pool?.userPairs?.length);
    if (pool?.userPairs?.length > 0) {
      console.log('User Liquidity Pools Loaded');
      console.log(pool.userPairs);
      console.log('User Liquidity Pools Loaded');
    }
    console.log(pool?.allocations?.length);
    if (pool?.allocations?.length > 0) {
      console.log('All Liquidity Pools Loaded');
      console.log(pool.userPairs);
      console.log('All Liquidity Pools Loaded');
      setLoadUserLiquidityPools(false);
    }
  }, [pool]);
  return (
    <>
      <HeaderLiquidityPool type="all" />
      <motion.div className="flex flex-col p-5 gap-6 ">
        {updatedPool.length ? (
          updatedPool?.map(item => (
            <ItemLiquidityPool
              key={v4()}
              {...item}
              type={ALL}
              item={item}
              {...props}
            />
          ))
        ) : (
          <h4 className="text-lg">Liquidity positions not found.</h4>
        )}
      </motion.div>
      <HeaderLiquidityPool type="yours" />
      <motion.div className="flex flex-col p-5 gap-6 ">
        {userPool.length ? (
          userPool?.map(item => (
            <ItemLiquidityPool
              key={v4()}
              {...item}
              type={YOURS}
              item={item}
              {...props}
            />
          ))
        ) : (
          // <h4 className="text-lg">You have no liquidity positions.</h4>
          <></>
        )}
        {loadUserLiquidityPools ? (
          <div className="flex flex-row justify-left items-center text-gray-400">
            <Loader type="Oval" color="#62d2cb" height={15} width={15} />
            <div className="pl-2 text-lg">Fetching user liquidity pools...</div>
          </div>
        ) : (
          <></>
        )}
      </motion.div>
    </>
  );
};

export default BodyLiquidityPool;
