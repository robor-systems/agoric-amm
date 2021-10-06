import PoolContext from 'context/PoolContext';
import React, { useContext } from 'react';
import PurseRemovePool from './PurseRemovePool';

const PursesRemovePool = () => {
  const [pool] = useContext(PoolContext);

  console.log(pool);

  return (
    <div className="flex flex-col text-lg gap-2 bg-alternative rounded-sm p-4">
      <h3>You Will Receive</h3>
      <div className="flex gap-4">
        <PurseRemovePool
          pool={
            pool.selectRemove && {
              ...pool.selectRemove?.central,
              value: pool.selectRemove?.centralValue,
            }
          }
          type="central"
        />
        <PurseRemovePool
          pool={
            pool.selectRemove && {
              ...pool.selectRemove?.liquidity,
              value: pool.selectRemove?.liquidityValue,
            }
          }
          type="liquidity"
        />
      </div>
    </div>
  );
};

export default PursesRemovePool;
