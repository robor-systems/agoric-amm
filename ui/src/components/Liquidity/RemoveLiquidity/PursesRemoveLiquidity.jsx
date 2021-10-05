import React from 'react';

const PursesRemoveLiquidity = () => {
  return (
    <div className="flex flex-col text-lg gap-2 bg-alternative rounded-sm p-4">
      <label htmlFor="amountToRemove">You Will Receive</label>
      <div className="flex gap-4">
        <div className="flex-grow bg-white h-14 rounded-sm"></div>
        <div className="flex-grow bg-white rounded-sm"></div>
      </div>
    </div>
  );
};

export default PursesRemoveLiquidity;
