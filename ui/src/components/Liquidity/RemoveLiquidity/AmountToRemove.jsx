import React from 'react';

const AmountToRemove = () => {
  return (
    <div className="flex flex-col text-lg gap-2 bg-alternative rounded-sm p-4 ">
      <label htmlFor="amountToRemove">Amount To Remove</label>
      <div className="relative">
        <input
          type="number"
          className="input-primary w-full"
          placeholder="0.00"
          id="amountToRemove"
        />
        <div className="text-xl absolute top-3 right-3 text-gray-400">%</div>
      </div>
    </div>
  );
};

export default AmountToRemove;
