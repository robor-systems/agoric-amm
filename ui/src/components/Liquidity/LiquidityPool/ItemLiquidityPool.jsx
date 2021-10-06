import PoolContext from 'context/PoolContext';
import React, { useContext } from 'react';

const ItemLiquidityPool = ({
  centralValue,
  liquidityValue,
  central,
  liquidity,
  item,
  handleClose,
}) => {
  const [pool, setPool] = useContext(PoolContext);

  return (
    <div className="border w-full p-4 flex flex-col gap-2 text-gray-500">
      <h3 className="font-medium text-lg text-black">
        {central.code}/{liquidity.code}
      </h3>

      <div className="flex justify-between ">
        <h4 className="text-md ">Share of Pool:</h4>
        <h4>{Number(liquidityValue / 100).toPrecision(4)}%</h4>
      </div>
      <div className="flex justify-between">
        <h4>{liquidity.code}</h4>
        <h4>{liquidityValue}</h4>
      </div>
      <div className="flex justify-between">
        <h4>{central.code}</h4>
        <h4>{centralValue}</h4>
      </div>
      <div className="flex gap-3 mt-2">
        <button className="btn-primary w-full p-0.5">Add</button>
        <button
          className="btn-primary w-full p-0.5"
          onClick={() => {
            setPool({ ...pool, selectRemove: item });
            handleClose();
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default ItemLiquidityPool;
