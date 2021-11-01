import React from 'react';

const HeaderLiquidityPool = ({ type }) => {
  return type === 'all' ? (
    <div className="border-b px-5 py-3">
      <h2 className="text-lg font-medium">All Liquidity Positions</h2>
    </div>
  ) : (
    <div className="px-5 py-3">
      <h2 className="text-lg text-gray-500 font-medium">
        Your Liquidity Positions:
      </h2>
    </div>
  );
};

export default HeaderLiquidityPool;
