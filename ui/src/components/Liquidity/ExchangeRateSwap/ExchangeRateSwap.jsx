import React from 'react';

const ExchangeRateSwap = ({ to, rate, from }) => {
  return (
    <div className="flex gap-4 text-gray-400 justify-between">
      Exchange Rate
      <div>
        1 {to.code} = {rate} {from.code}
      </div>
    </div>
  );
};

export default ExchangeRateSwap;
