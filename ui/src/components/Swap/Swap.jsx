import { motion } from 'framer-motion';

import clsx from 'clsx';
import { useApplicationContext } from 'context/Application';
import AssetContext from 'context/AssetContext';
import {
  makeRatioFromAmounts,
  floorMultiplyBy,
  floorDivideBy,
} from '@agoric/zoe/src/contractSupport';
import { AmountMath } from '@agoric/ertp';
import { stringifyAmountValue } from '@agoric/ui-components';
import { Nat } from '@agoric/nat';
import { getInfoForBrand, displayPetname } from 'utils/helpers';
import { requestRatio } from 'services/swap.service';

import React, { useContext, useEffect, useState } from 'react';
import { FiChevronDown, FiChevronUp, FiRepeat } from 'react-icons/fi';
import ExchangeRateSwap from './ExchangeRateSwap/ExchangeRateSwap';
import OptionsSwap from './OptionsSwap/OptionsSwap';
import SectionSwap from './SectionSwap/SectionSwap';

const Swap = () => {
  const [asset, setAsset] = useContext(AssetContext);
  const [optionsEnabled, setOptionsEnabled] = useState(false);
  const [error, setError] = useState(null);
  const [swapFrom, setSwapFrom] = useState('');
  const [swapTo, setSwapTo] = useState('');
  const [assetExchange, setAssetExchange] = useState(null);
  const assetExists = Object.values(asset).filter(item => item).length >= 2;

  // get state
  const { state } = useApplicationContext();

  const {
    brandToInfo,
    autoswap: { ammAPI, centralBrand },
  } = state;

  const makeInverseFromAmounts = (x, y) => makeRatioFromAmounts(y, x);
  const composeRatio = (x, y) =>
    makeRatioFromAmounts(floorMultiplyBy(x.numerator, y), x.denominator);

  const getExchangeRate = (placesToShow, marketRate, inputRate, outputRate) => {
    const giveInfo = getInfoForBrand(brandToInfo, inputRate.brand);
    const wantInfo = getInfoForBrand(brandToInfo, outputRate.brand);
    const oneDisplayUnit = 10n ** Nat(wantInfo.decimalPlaces);
    const wantPrice = floorDivideBy(
      AmountMath.make(outputRate.brand, oneDisplayUnit),
      marketRate,
    );
    const exchangeRate = stringifyAmountValue(
      wantPrice,
      giveInfo.assetKind,
      giveInfo.decimalPlaces,
      placesToShow,
    );

    setAssetExchange({
      to: {
        code: displayPetname(wantInfo.petname),
      },
      from: { code: displayPetname(giveInfo.petname) },
      rate: exchangeRate,
    });
  };

  /**
   * The `marketRate` is the ratio between the input asset
   * and the output asset. It is computed by getting the market
   * price for each pool, and composing them. If one of the
   * selected assets is the central token, that "poolRate"
   * is just 1:1 (centralOnlyRate, above).
   *
   * Becuase the ratios are queries async, the state for
   * them starts as `{ brand, amount: null }`. The brand is
   * used to check at `set` time that the brand has not changed;
   * e.g., because the user selected a purse with a different
   * brand.
   *
   * The input `poolRate` is `RUN/inputBrand` and the output
   * `poolRate` is `outputBrand/RUN`.
   */

  useEffect(() => {
    const getRates = async () => {
      let inputRate = null;
      asset.from &&
        (inputRate = await requestRatio(
          asset.from.brand,
          makeRatioFromAmounts,
          centralBrand,
          ammAPI,
        ));
      let outputRate = null;
      asset.to &&
        (outputRate = await requestRatio(
          asset.to.brand,
          makeInverseFromAmounts,
          centralBrand,
          ammAPI,
        ));

      const marketRate =
        inputRate?.ratio && outputRate?.ratio
          ? composeRatio(inputRate.ratio, outputRate.ratio)
          : null;

      marketRate && getExchangeRate(4, marketRate, inputRate, outputRate);
    };
    if ((asset.from || asset.to) && ammAPI) {
      getRates();
    }
  }, [asset, ammAPI, centralBrand]);

  useEffect(() => {
    Object.values(asset).filter(item => item).length >= 2 && setError(null);
  }, [asset]);

  useEffect(() => {
    if (swapFrom && swapTo) setError(null);

    if (asset?.from?.purse?.balance < swapFrom)
      setError(`Insufficient ${asset.from.code} balance`);
  }, [swapFrom, swapTo]);

  const handleSwap = () => {};

  return (
    <motion.div
      layout
      className="flex flex-col p-4 shadow-red-light rounded-sm gap-4 w-screen max-w-lg relative  select-none"
    >
      <div className="flex justify-between items-center gap-8 ">
        <h1 className="text-2xl font-semibold">Swap</h1>
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

      {assetExists && assetExchange && <ExchangeRateSwap {...assetExchange} />}

      <button
        className={clsx(
          'bg-gray-100 hover:bg-gray-200 text-xl  font-medium p-3  uppercase',
          assetExists
            ? 'bg-primary hover:bg-primaryDark text-white'
            : 'text-gray-500',
        )}
        onClick={() => {
          if (Object.values(asset).filter(item => item).length < 2)
            setError('Please select assets first');
          else if (!(swapFrom && swapTo)) {
            setError('Please enter the amount first');
          } else {
            handleSwap;
          }
        }}
      >
        swap
      </button>

      {error && (
        <motion.h3 layout className="text-red-600">
          {error}
        </motion.h3>
      )}
    </motion.div>
  );
};

export default Swap;
