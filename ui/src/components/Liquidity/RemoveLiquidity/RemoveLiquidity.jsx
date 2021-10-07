import clsx from 'clsx';
import AssetContext from 'context/AssetContext';
import PoolContext from 'context/PoolContext';
import React, { useContext, useEffect, useState } from 'react';
import { FiArrowDown } from 'react-icons/fi';
import AmountToRemove from './AmountToRemove';
import PoolSelector from './PoolSelector/PoolSelector';
import PursesRemovePool from './PursesRemovePool/PursesRemovePool';

const RemoveLiquidity = props => {
  const [pool] = useContext(PoolContext);
  const [error, setError] = useState(false);
  const [asset, setAsset] = useContext(AssetContext);
  const [amount, setAmount] = useState('');

  const handleRemovePool = () => {
    if (!pool?.selectRemove) setError('Please select pool first');
    else if (!amount) setError('Please enter the amount first');
    else if (!(asset?.central && asset.liquidity))
      setError('Please select the purses first');
  };

  useEffect(() => {
    setAmount('');
    setAsset({ central: null, liquidity: null });
  }, [pool?.selectRemove]);

  useEffect(() => {
    (pool?.selectRemove || amount || (asset?.central && asset?.liquidity)) &&
      setError(null);
  }, [pool, amount, asset]);

  return (
    <div className="flex flex-col   gap-4">
      <PoolSelector {...props} />
      <div className="flex flex-col  gap-4 relative">
        <AmountToRemove value={amount} setValue={setAmount} />
        <FiArrowDown className=" p-2 bg-alternative text-3xl absolute left-6  ring-4 ring-white position-swap-icon-remove" />
        <PursesRemovePool />
      </div>
      <button
        className={clsx(
          'bg-gray-100 hover:bg-gray-200 text-xl  font-medium p-3  uppercase',
          0 ? 'bg-primary hover:bg-primaryDark text-white' : 'text-gray-500',
        )}
        onClick={handleRemovePool}
      >
        Confirm Withdrawal
      </button>
      {error && <h3 className="text-red-600">{error}</h3>}
    </div>
  );
};

export default RemoveLiquidity;
