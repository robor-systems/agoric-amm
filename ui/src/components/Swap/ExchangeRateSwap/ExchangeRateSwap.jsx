import React from 'react';

const ExchangeRateSwap = ({ want, rate, give }) => {
  return (
    <div className="flex gap-4 text-gray-400 justify-between">
      Exchange Rate
      <div>
        1 {want.code} = {rate} {give.code}
      </div>
    </div>
  );
};

export default ExchangeRateSwap;
