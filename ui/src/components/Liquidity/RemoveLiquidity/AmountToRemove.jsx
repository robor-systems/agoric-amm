import React from 'react';

const AmountToRemove = () => {
  return (
    <div className="flex flex-col text-lg gap-2 bg-alternative rounded-sm p-4 ">
      <label htmlFor="amountToRemove">Amount To Remove</label>
      <input type="number" className="input-primary" id="amountToRemove" />
    </div>
  );
};

export default AmountToRemove;
