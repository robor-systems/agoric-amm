import React from 'react';

const RateLiquidity = ({ central, rate, liquidity, liquidityValue }) => {
  console.log(central, rate, liquidity);
  const total = 100;
  return (
    <div className="flex gap-4 text-gray-400 justify-between">
      <div className="flex flex-col ">
        <h3>
          {rate} {liquidity.code} per {central.code}
        </h3>
        <h3>
          {Number(1 / rate).toPrecision(4)} {central.code} per {liquidity.code}
        </h3>
      </div>
      <div className="flex flex-col items-end">
        <h3>{Number(liquidityValue / total).toPrecision(4)}%</h3>
        <h3>Share of pool</h3>
      </div>
    </div>
  );
};

export default RateLiquidity;
