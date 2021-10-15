import PoolContext from 'context/PoolContext';
import { v4 } from 'uuid';
import { motion } from 'framer-motion';

import { FiPlus } from 'react-icons/fi';
import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import AssetContext from 'context/AssetContext';
import { assetState } from 'utils/constant';
import CentralAssetLiquidity from '../SectionLiquidity/CentralAssetLiquidity';
import SectionLiquidity from '../SectionLiquidity/SectionLiquidity';
import RateLiquidity from '../RateLiquidity/RateLiquidity';

// TODO(danish): store liquidity central and liquidity values in a context and if both exist then determine if pool already exists in contract
// if pool exists then set a fixed exchange rate. Otherwise, allow user to insert whatever ratio of tokens
// 2. Show all liquidity in liquidity positions, read wallet's liquidity positions from the wallet
// 3. consider case where liquidity exists and user already has said liquidity and wants to add more.

const AddLiquidity = () => {
  const [centralValue, setCentralValue] = useState(0);
  const [liquidityValue, setLiquidityValue] = useState(0);
  const [error, setError] = useState(null);
  const [asset, setAsset] = useContext(AssetContext);
  const [pool, setPool] = useContext(PoolContext);
  const assetExists =
    Object.values(asset).filter(item => item?.purse).length >= 2;

  useEffect(() => {
    if (centralValue && liquidityValue) setError(null);
    if (asset.central?.purse.balance < centralValue)
      setError(`Insufficient ${asset.central.code} balance`);
    else if (asset.liquidity?.purse.balance < liquidityValue)
      setError(`Insufficient ${asset.liquidity.code} balance`);
    else setError(null);
  }, [centralValue, liquidityValue]);

  useEffect(() => {
    Object.values(asset).filter(item => item?.purse).length >= 2 &&
      setError(null);
    if (asset.central?.mode === assetState.EMPTY) {
      setError(assetState.EMPTY);
    } else setError(null);
  }, [asset]);

  return (
    <motion.div
      className="flex flex-col gap-4"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-4 relative">
        <CentralAssetLiquidity
          type="central"
          value={centralValue}
          handleChange={({ target }) => {
            setCentralValue(parseFloat(Number(target.value).toFixed(9)));
            setLiquidityValue(
              parseFloat(Number(target.value * 1.12).toFixed(9)),
            );
          }}
        />

        <FiPlus className="transform-gpu rotate-90 p-2 bg-alternative text-3xl absolute left-6  ring-4 ring-white position-swap-icon" />

        <SectionLiquidity
          disabled={error === assetState.EMPTY}
          type="liquidity"
          value={liquidityValue}
          handleChange={({ target }) => {
            setLiquidityValue(parseFloat(Number(target.value).toFixed(9)));
            setCentralValue(parseFloat(Number(target.value / 1.12).toFixed(9)));
          }}
        />
      </div>
      {assetExists && (
        <RateLiquidity {...asset} rate={1.12} liquidityValue={liquidityValue} />
      )}

      <button
        className={clsx(
          'bg-gray-100 hover:bg-gray-200 text-xl  font-medium p-3  uppercase',
          assetExists
            ? 'bg-primary hover:bg-primaryDark text-white'
            : 'text-gray-500',
        )}
        disabled={error === assetState.EMPTY}
        onClick={() => {
          if (!assetExists) setError('Please select assets first');
          else if (!(liquidityValue && centralValue)) {
            setError('Please enter the amounts first');
          } else {
            setPool({
              ...pool,
              data: pool.data.concat({
                ...asset,
                id: v4(),
                liquidityValue,
                centralValue,
              }),
            });
            setLiquidityValue('');
            setCentralValue('');
            setAsset({ ...asset, liquidity: null });
          }
        }}
      >
        ADD LIQUIDITY
      </button>

      {error && (
        <h3 className="text-red-600">
          {error === assetState.EMPTY ? (
            <div>
              RUN is required to add liquidity.{' '}
              <a href="" target="_blank" className="font-bold underline">
                Get RUN
              </a>{' '}
            </div>
          ) : (
            error
          )}
        </h3>
      )}
    </motion.div>
  );
};

export default AddLiquidity;
