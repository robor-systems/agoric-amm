import { FiPlus } from 'react-icons/fi';
import React, { useContext, useEffect, useState } from 'react';
import SectionLiquidity from '../SectionLiquidity/SectionLiquidity';
import clsx from 'clsx';
import AssetContext from 'context/AssetContext';
import CentralAssetLiquidity from '../SectionLiquidity/CentralAssetLiquidity';
import { assetState } from 'utils/constant';

const AddLiquidity = () => {
  const [centralAsset, setCentralAsset] = useState('');
  const [liquidityAsset, setLiquidityAsset] = useState('');
  const [swapTo, setSwapTo] = useState('');
  const [swapFrom, setSwapFrom] = useState('');
  const [error, setError] = useState(null);
  const [asset, setAsset] = useContext(AssetContext);
  const assetExists = Object.values(asset).filter(item => item).length >= 2;

  useEffect(() => {
    if (swapFrom && swapTo) setError(null);
    if (asset.from?.balance < swapFrom)
      setError(`Insufficient ${asset.from.code} balance`);
  }, [swapFrom, swapTo]);

  useEffect(() => {
    Object.values(asset).filter(item => item).length >= 2 && setError(null);
    asset.central?.mode === assetState.EMPTY
      ? setError(assetState.EMPTY)
      : setError(null);
  }, [asset]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 relative">
        <CentralAssetLiquidity
          type="central"
          value={centralAsset}
          handleChange={({ target }) => {
            setCentralAsset(target.value);
            // setSwapTo(target.value / 2);
          }}
        />

        <FiPlus className="transform-gpu rotate-90 p-2 bg-alternative text-3xl absolute left-6  ring-4 ring-white position-swap-icon " />

        <SectionLiquidity
          disabled={error === assetState.EMPTY}
          type="liquidity"
          value={liquidityAsset}
          handleChange={({ target }) => {
            setLiquidityAsset(target.value);
            // setSwapFrom(target.value * 2);
          }}
        />
      </div>
      <button
        className={clsx(
          'bg-gray-100 hover:bg-gray-200 text-xl  font-medium p-3  uppercase',
          assetExists
            ? 'bg-primary hover:bg-primaryDark text-white'
            : 'text-gray-500',
        )}
        disabled={error === assetState.EMPTY}
        onClick={() => {
          if (Object.values(asset).filter(item => item).length < 2)
            setError('Please select assets first');
          else if (!(swapFrom && swapTo)) {
            setError('Please enter the amount first');
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
    </div>
  );
};

export default AddLiquidity;
