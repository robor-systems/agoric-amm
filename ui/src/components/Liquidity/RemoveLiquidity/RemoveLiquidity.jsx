import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import AssetContext from 'context/AssetContext';
import PoolContext from 'context/PoolContext';
import { useApplicationContext } from 'context/Application';

import { motion } from 'framer-motion';
import { FiArrowDown } from 'react-icons/fi';

import { removeLiquidityService } from 'services/liquidity.service';

import AmountToRemove from './AmountToRemove';
import PoolSelector from './PoolSelector/PoolSelector';
import PursesRemovePool from './PursesRemovePool/PursesRemovePool';

const RemoveLiquidity = props => {
  const [pool] = useContext(PoolContext);
  const [error, setError] = useState(false);
  const [asset, setAsset] = useContext(AssetContext);
  const [amount, setAmount] = useState('');
  const [validated, setValidated] = useState(false);

  // get state
  const { state, walletP } = useApplicationContext();

  const {
    brandToInfo,
    autoswap: { ammAPI, centralBrand },
    purses,
  } = state;

  const handleRemovePool = () => {
    if (!asset.centralRemove && !asset.secondaryRemove) {
      setError('Please select purses first');
      return;
    } else if (!amount) {
      setError('Please enter the amount first');
      return;
    }

    asset.centralRemove &&
      asset.secondaryRemove &&
      removeLiquidityService(
        asset.centralRemove,
        asset.secondaryRemove,
        amount,
        purses,
        ammAPI,
        walletP,
      );

    // // reset values
    // setAsset({ centralRemove: undefined, secondaryRemove: undefined });
    // setAmount('');
  };

  useEffect(() => {
    setAmount('');
    setAsset({ central: null, liquidity: null });
  }, [pool?.selectRemove]);

  useEffect(() => {
    (amount || (asset?.centralRemove && asset?.secondaryRemove)) &&
      setError(null);

    setValidated(false);
    amount &&
      asset?.centralRemove?.purse &&
      asset?.secondaryRemove?.purse &&
      setValidated(true);
  }, [amount, asset]);

  return (
    <motion.div
      className="flex flex-col gap-4"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <PoolSelector {...props} />
      <div className="flex flex-col  gap-4 relative">
        <AmountToRemove
          value={amount}
          setValue={setAmount}
          poolShare={asset?.secondaryRemove?.liquidityInfo?.User?.share}
        />
        <FiArrowDown
          className={
            'p-2 bg-alternative text-3xl absolute left-6 ring-4 ring-white position-swap-icon-remove'
          }
          style={{ top: asset.secondaryRemove ? '48.5%' : '' }}
        />
        <PursesRemovePool amount={amount} />
      </div>
      <button
        className={clsx(
          'bg-gray-100 hover:bg-gray-200 text-xl  font-medium p-3  uppercase',
          validated
            ? 'bg-primary hover:bg-primaryDark text-white'
            : 'text-gray-500',
        )}
        onClick={handleRemovePool}
      >
        Confirm Withdrawal
      </button>
      {error && <h3 className="text-red-600">{error}</h3>}
    </motion.div>
  );
};

export default RemoveLiquidity;
