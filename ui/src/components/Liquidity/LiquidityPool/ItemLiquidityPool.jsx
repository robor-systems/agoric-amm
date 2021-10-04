import React from 'react';

const ItemLiquidityPool = () => {
  return (
    <div className="border w-full p-4 flex flex-col gap-2 text-gray-500">
      <h3 className="font-medium text-lg text-black">RUN/ATOM</h3>

      <div className="flex justify-between ">
        <h4 className="text-md ">Share of Pool:</h4>
        <h4>1.13%</h4>
      </div>
      <div className="flex justify-between">
        <h4>ATOM</h4>
        <h4>2.300</h4>
      </div>
      <div className="flex justify-between">
        <h4>RUN</h4>
        <h4>5.600</h4>
      </div>
      <div className="flex gap-3 mt-2">
        <button className="btn-primary w-full p-0.5">Add</button>
        <button className="btn-primary w-full p-0.5">Remove</button>
      </div>
    </div>
  );
};

export default ItemLiquidityPool;
