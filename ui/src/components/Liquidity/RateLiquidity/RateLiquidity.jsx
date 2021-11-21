import React from 'react';

const RateLiquidity = ({ central, secondary, rate }) => {
  return (
    <div className="flex gap-4 text-gray-400 justify-between">
      <div className="flex flex-col ">
        <h3>
          1 {secondary?.code} = {rate} {central?.code}
        </h3>
        <h3>
          1 {central?.code} = {Number(1 / rate).toPrecision(4)}{' '}
          {secondary?.code}
        </h3>
      </div>
      {/* <div className="flex flex-col items-end">
        <h3>{Number(liquidityValue / total).toPrecision(4)}%</h3>
        <h3>Share of pool</h3>
      </div> */}
    </div>
  );
};

export default RateLiquidity;
