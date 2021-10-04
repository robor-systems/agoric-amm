import React from 'react';
import HeaderLiquidityPool from './HeaderLiquidityPool';
import ItemLiquidityPool from './ItemLiquidityPool';

const BodyLiquidityPool = () => {
  return (
    <div>
      <HeaderLiquidityPool />

      <div className="flex flex-col p-5">
        <ItemLiquidityPool />
      </div>
    </div>
  );
};

export default BodyLiquidityPool;
