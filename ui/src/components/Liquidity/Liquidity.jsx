import clsx from 'clsx';
import AssetContext from 'context/AssetContext';
import React, { useContext, useEffect, useState } from 'react';
import { FiChevronDown, FiChevronUp, FiRepeat } from 'react-icons/fi';
import ExchangeRateSwap from './ExchangeRateSwap/ExchangeRateSwap';
import OptionsSwap from './OptionsSwap/OptionsSwap';
import SectionSwap from './SectionSwap/SectionSwap';

const Liquidity = () => {
  const [asset, setAsset] = useContext(AssetContext);
  const [optionsEnabled, setOptionsEnabled] = useState(false);
  const [error, setError] = useState(null);
  const [swapFrom, setSwapFrom] = useState('');
  const [swapTo, setSwapTo] = useState('');
  const assetExists = Object.values(asset).filter(item => item).length >= 2;

  useEffect(() => {
    Object.values(asset).filter(item => item).length >= 2 && setError(null);
  }, [asset]);

  useEffect(() => {
    if (swapFrom && swapTo) setError(null);
    if (asset.from?.balance < swapFrom)
      setError(`Insufficient ${asset.from.code} balance`);
  }, [swapFrom, swapTo]);

  return (
    <div className=" flex flex-col p-4 shadow-red-light rounded-sm gap-4 w-full max-w-lg relative  select-none">
      <div className="flex justify-between items-center gap-8 ">
        <h1 className="text-2xl font-semibold">Liquidity</h1>
        <h3
          className="flex  items-center text-sm gap-2 p-1 text-gray-500 cursor-pointer hover:bg-gray-100 rounded-sm"
          onClick={() => {
            setOptionsEnabled(!optionsEnabled);
          }}
        >
          More options {optionsEnabled ? <FiChevronUp /> : <FiChevronDown />}
        </h3>
      </div>
      {optionsEnabled && <OptionsSwap />}

      <div className="flex flex-col gap-4 relative">
        <SectionSwap
          type="from"
          value={swapFrom}
          handleChange={({ target }) => {
            setSwapFrom(target.value);

            setSwapTo(target.value / 2);
          }}
        />

        <FiRepeat
          className="transform-gpu rotate-90 p-2 bg-alternative text-3xl absolute left-6  ring-4 ring-white position-swap-icon cursor-pointer hover:bg-alternativeDark"
          onClick={() => {
            setAsset({
              from: asset.to,
              to: asset.from,
            });
          }}
        />

        <SectionSwap
          type="to"
          value={swapTo}
          handleChange={({ target }) => {
            setSwapTo(target.value);
            setSwapFrom(target.value * 2);
          }}
        />
      </div>

      {assetExists && <ExchangeRateSwap {...asset} rate={1.12} />}

      <button
        className={clsx(
          'bg-gray-100 hover:bg-gray-200 text-xl font-medium p-3  uppercase',
          { 'bg-primary hover:bg-primaryDark text-white': assetExists },
        )}
        onClick={() => {
          if (Object.values(asset).filter(item => item).length < 2)
            setError('Please select assets first');
          else if (!(swapFrom && swapTo)) {
            setError('Please enter the amount first');
          }
        }}
      >
        swap
      </button>

      {error && <h3 className="text-red-600">{error}</h3>}
    </div>
  );
};

export default Liquidity;
