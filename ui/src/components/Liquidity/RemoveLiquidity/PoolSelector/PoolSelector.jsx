import PoolContext from 'context/PoolContext';
import React, { useContext, useEffect } from 'react';

const PoolSelector = ({ setOpen }) => {
  const [pool] = useContext(PoolContext);
  useEffect(() => {
    console.log('test');
    console.log(pool.selectRemove);
    console.log('test');
  }, [pool.selectRemove]);
  return (
    <div className="flex justify-between">
      <h2 className="text-lg font-medium">
        {pool?.selectRemove
          ? `${pool.selectRemove.central.code}/${pool.selectRemove.liquidity.code} Pool`
          : 'No Pool Selected'}
        {pool.selectRemove}
      </h2>

      <a
        className="text-lg text-primary hover:underline cursor-pointer"
        onClick={() => {
          setOpen(true);
        }}
      >
        {pool?.selectRemove ? `Change Pool` : 'Choose'}
      </a>
    </div>
  );
};

export default PoolSelector;
