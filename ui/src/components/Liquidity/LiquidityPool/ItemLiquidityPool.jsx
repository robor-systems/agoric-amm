import PoolContext from 'context/PoolContext';
import React, { useContext } from 'react';

const ALL = 'ALL';
const YOURS = 'YOURS';

const ItemLiquidityPool = ({ Central, Secondary, type, item, handleClose }) => {
  const [pool, setPool] = useContext(PoolContext);
  console.log(Central, Secondary);

  return (
    <div className="border w-full p-4 flex flex-col gap-2 text-gray-500">
      <h3 className="font-medium text-lg text-black">
        {Central.info?.petname} / {Secondary.info?.petname}
      </h3>
      {type === YOURS ? (
        <div className="flex justify-between ">
          <h4 className="text-md ">Share of Pool:</h4>
          {/* <h4>{Number(liquidityValue / 100).toPrecision(4)}%</h4> */}
        </div>
      ) : (
        ''
      )}
      <div className="flex justify-between">
        <h4>{Central.info?.petname}</h4>
        <h4>{Central.value}</h4>
      </div>
      <div className="flex justify-between">
        <h4>{Secondary.info?.petname}</h4>
        <h4>{Secondary.value}</h4>
      </div>
      <div className="flex gap-3 mt-2">
        <button className="btn-primary w-full p-0.5">Add</button>
        {type === YOURS ? (
          <button
            className="btn-primary w-full p-0.5"
            onClick={() => {
              setPool({ ...pool, selectRemove: item });
              handleClose();
            }}
          >
            Remove
          </button>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default ItemLiquidityPool;
