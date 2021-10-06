import PoolContext from 'context/PoolContext';
import React, { useContext } from 'react';
import { v4 } from 'uuid';

import HeaderLiquidityPool from './HeaderLiquidityPool';
import ItemLiquidityPool from './ItemLiquidityPool';

const BodyLiquidityPool = props => {
  const [pool] = useContext(PoolContext);

  return (
    <div>
      <HeaderLiquidityPool />
      <div className="flex flex-col p-5 gap-6">
        {pool.data.length ? (
          pool.data.map(item => (
            <ItemLiquidityPool key={v4()} {...item} item={item} {...props} />
          ))
        ) : (
          <h4 className="text-lg">There are no current liquidity positions.</h4>
        )}
      </div>
    </div>
  );
};

export default BodyLiquidityPool;
