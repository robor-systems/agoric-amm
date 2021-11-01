import PoolContext from 'context/PoolContext';
import { useApplicationContext } from 'context/Application';
import React, { useState, useEffect, useContext } from 'react';
import { v4 } from 'uuid';

import { getInfoForBrand } from 'utils/helpers';
import { stringifyNat } from '@agoric/ui-components/dist/display/natValue/stringifyNat';

import HeaderLiquidityPool from './HeaderLiquidityPool';
import ItemLiquidityPool from './ItemLiquidityPool';

// decimal places to show in input
const PLACES_TO_SHOW = 2;
const ALL = 'ALL';
const YOURS = 'YOURS';

const BodyLiquidityPool = props => {
  const [pool] = useContext(PoolContext);
  const [updatedPool, setUpdatedPool] = useState([]);
  const [userPool, setUserPool] = useState([]);

  // get state
  const { state } = useApplicationContext();
  const { brandToInfo } = state;

  useEffect(() => {
    const updatePools = () => {
      const newPool = pool.allocations.map(item => {
        const central = item.Central;
        const secondary = item.Secondary;
        // CMT(danish): liquidity not being used currently but might have some use in the future
        // const liquidity = item.Liquidity;

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
    };
    pool.allocations && updatePools();
  }, []);

  return (
    <>
      <HeaderLiquidityPool type="all" />
      <div className="flex flex-col p-5 gap-6 ">
        {updatedPool.length ? (
          updatedPool.map(item => (
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
      </div>
      <HeaderLiquidityPool type="yours" />
      <div className="flex flex-col p-5 gap-6 ">
        {userPool.length ? (
          userPool.map(item => (
            <ItemLiquidityPool
              key={v4()}
              {...item}
              type={YOURS}
              item={item}
              {...props}
            />
          ))
        ) : (
          <h4 className="text-lg">You have no liquidity positions.</h4>
        )}
      </div>
    </>
  );
};

export default BodyLiquidityPool;
