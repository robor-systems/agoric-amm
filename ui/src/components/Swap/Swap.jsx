import { motion } from 'framer-motion';
import Loader from 'react-loader-spinner';
import { toast, ToastContainer } from 'react-toastify';
import clsx from 'clsx';
import { useApplicationContext } from 'context/Application';
import { setToast } from '../../utils/helpers';
import AssetContext from 'context/AssetContext';
import {
  makeRatioFromAmounts,
  floorMultiplyBy,
  floorDivideBy,
  invertRatio,
} from '@agoric/zoe/src/contractSupport';
import { AmountMath } from '@agoric/ertp';
import { stringifyAmountValue } from '@agoric/ui-components';
import { parseAsNat } from '@agoric/ui-components/dist/display/natValue/parseAsNat';
import { Nat } from '@agoric/nat';
import { getInfoForBrand, displayPetname } from 'utils/helpers';
import { requestRatio, makeSwapOffer } from 'services/swap.service';
import { stringifyNat } from '@agoric/ui-components/dist/display/natValue/stringifyNat';
import { divide, multiply } from 'lodash';

import React, { useContext, useEffect, useState } from 'react';
import { FiChevronDown, FiChevronUp, FiRepeat, FiCheck } from 'react-icons/fi';
import { BiErrorCircle } from 'react-icons/bi';
import ExtraInformation from './ExtraInformation/ExtraInformation';
import OptionsSwap from './OptionsSwap/OptionsSwap';
import SectionSwap from './SectionSwap/SectionSwap';

// decimal places to show in input
const PLACES_TO_SHOW = 2;
const UNIT_BASIS = 10000;
const UNIT_BASIS_NAT = 10000n;

const SWAP_IN = 'IN';
const SWAP_OUT = 'OUT';

const Swap = () => {
  const [asset, setAsset] = useContext(AssetContext);
  const [optionsEnabled, setOptionsEnabled] = useState(false);
  const [error, setError] = useState(null);
  const [assetloader, setAssetLoader] = useState(false);
  const [exchangeRateLoader, setExchangeRateLoader] = useState(false);
  const [swapFrom, setSwapFrom] = useState({
    decimal: undefined,
    nat: 0n,
    limitDec: 0,
    limitNat: 0n,
  });
  const [swapTo, setSwapTo] = useState({
    decimal: undefined,
    nat: 0n,
    limitDec: 0,
    limitNat: 0n,
  });
  const [slippage, setSlippage] = useState(3);
  const [assetExchange, setAssetExchange] = useState(null);
  const [swapped, setSwapped] = useState(false);
  const assetExists = Object.values(asset).filter(item => item).length >= 2;
  const [swapType, setSwapType] = useState(SWAP_IN);
  // get state
  const { state, walletP } = useApplicationContext();
  const {
    brandToInfo,
    walletOffers,
    autoswap: { ammAPI, centralBrand },
  } = state;
  const [currentOfferId, setCurrentOfferId] = useState(walletOffers.length);
  const [swapButtonStatus, setSwapButtonStatus] = useState('Swap');
  useEffect(() => {
    brandToInfo.length <= 0 ? setAssetLoader(true) : setAssetLoader(false);
  }, []);
  useEffect(() => {
    if (swapped) {
      if (walletOffers[currentOfferId]?.status === 'accept') {
        setSwapButtonStatus('Swapped');

        setToast('clear', 'dismiss', null);
        setTimeout(() => {
          setToast('Assets successfully swapped', 'success', null);
        }, 500);
        setTimeout(() => {
          setSwapped(false);
          setSwapButtonStatus('Swap');
        }, 3000);
      } else if (walletOffers[currentOfferId]?.status === 'decline') {
        setSwapButtonStatus('declined');
        setToast('clear', 'dismiss', null);
        setTimeout(() => {
          setToast('Swap declined by User', 'error', null);
        }, 500);
        setTimeout(() => {
          setSwapped(false);
          setSwapButtonStatus('Swap');
        }, 3000);
      } else if (walletOffers[currentOfferId]?.error) {
        setSwapButtonStatus('rejected');
        setToast('clear', 'dismiss', null);
        setTimeout(() => {
          setToast('Swap offer rejected by Wallet', 'warning', null);
        }, 500);
        setTimeout(() => {
          setSwapped(false);
          setSwapButtonStatus('Swap');
        }, 3000);
      }
    }
  }, [walletOffers[currentOfferId]]);
  const makeInverseFromAmounts = (x, y) => makeRatioFromAmounts(y, x);
  const composeRatio = (x, y) =>
    makeRatioFromAmounts(floorMultiplyBy(x.numerator, y), x.denominator);

  const getExchangeRate = (placesToShow, marketRate, inputRate, outputRate) => {
    setSwapFrom({ decimal: 0, nat: 0n });
    setSwapTo({ decimal: 0, nat: 0n });
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
    setExchangeRateLoader(current => !current);

    setAssetExchange({
      give: { code: displayPetname(giveInfo.petname), giveInfo },
      want: {
        code: displayPetname(wantInfo.petname),
        wantInfo,
      },
      rate: exchangeRate,
      marketRate,
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

  const getRates = async () => {
    if (asset.from && asset.to && !exchangeRateLoader) {
      setExchangeRateLoader(current => !current);
    }
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

  useEffect(() => {
    if ((asset.from || asset.to) && ammAPI) {
      getRates();
    }
  }, [asset, ammAPI, centralBrand]);

  useEffect(() => {
    Object.values(asset).filter(item => item).length >= 2 && setError(null);
  }, [asset]);

  useEffect(() => {
    if (swapFrom && swapTo) {
      setError(null);
    }
    if (
      parseFloat(asset?.from?.purse?.balance) < parseFloat(swapFrom.decimal)
    ) {
      setError(`Insufficient ${asset.from.code} balance`);
    }
  }, [swapFrom, swapTo]);

  // If the user entered the "In" amount, then keep that fixed and
  // change the output by the slippage.
  const handleSwap = () => {
    if (!(swapFrom.decimal || swapTo.decimal)) {
      setError('Please add input first');
      return;
    } else if (Number(swapFrom.decimal) === 0 || Number(swapTo.decimal) === 0) {
      setError('Add value greater than zero');
      return;
    } else if (!swapTo.limitNat && !swapFrom.limitNat) {
      setError('Something went wrong while setting slippage');
      return;
    } else if (error) {
      return;
    }
    setToast('Please approve the offer in your wallet.', 'loading', null);
    setCurrentOfferId(walletOffers.length);
    console.log('saving current OfferId :', currentOfferId);
    console.log(
      walletP,
      ammAPI,
      asset.from.purse,
      swapType === SWAP_IN ? swapFrom.nat : swapFrom.limitNat,
      asset.to.purse,
      swapType === SWAP_OUT ? swapTo.nat : swapTo.limitNat,
      true,
    );

    makeSwapOffer(
      walletP,
      ammAPI,
      asset.from.purse,
      swapType === SWAP_IN ? swapFrom.nat : swapFrom.limitNat,
      asset.to.purse,
      swapType === SWAP_OUT ? swapTo.nat : swapTo.limitNat,
      true, // swapIn will always be true
    );
    setSwapped(true);
  };

  const handleInputChange = ({ target }) => {
    if (asset.to && asset.from) {
      let newInput = target.value;
      if (newInput < 0) {
        newInput = 0;
      } else if (!newInput) {
        const reset = {
          decimal: undefined,
          nat: 0n,
          limitDec: 0,
          limitNat: 0n,
        };
        setSwapFrom(reset);
        setSwapTo(reset);
        console.log('Reseting Value');
        console.log(swapFrom);
        console.log(swapTo);
        return;
      }

      // parse as Nat value
      const swapFromNat = parseAsNat(
        newInput,
        asset.from?.purse?.displayInfo?.decimalPlaces,
      );

      setSwapFrom({ decimal: newInput, nat: swapFromNat, limitNat: 0n });
      setSwapType(SWAP_IN);
      // agoric stuff
      const amountMakeFrom = AmountMath.make(asset.from.brand, swapFromNat);

      // calculate swapTo price
      // multiply userInput 'from' amount to 'to' amount using provided rate.
      const swapToNat = floorMultiplyBy(
        amountMakeFrom,
        assetExchange.marketRate,
      );
      // convert bigInt to int, seems extra but doing it for consistent decimal places
      const ToValString = stringifyNat(
        swapToNat.value,
        asset.to?.purse?.displayInfo?.decimalPlaces,
        PLACES_TO_SHOW,
      );

      // calculating slippage
      const slippagePerc = divide(slippage, 100);
      const slippageUnit = multiply(slippagePerc * UNIT_BASIS);
      const maxSlippageUnit = slippageUnit + UNIT_BASIS;
      const maxSlippageUnitNat = parseAsNat(maxSlippageUnit.toString(), 0);

      const lowerLimitNat =
        (swapToNat.value * UNIT_BASIS_NAT) / maxSlippageUnitNat;

      const lowerLimitDec = stringifyNat(
        lowerLimitNat,
        asset.to?.purse?.displayInfo?.decimalPlaces,
        PLACES_TO_SHOW,
      );

      if (lowerLimitNat < 0n) {
        setError('Value too small, no room for slippage.');
        return;
      } else {
        // console.log('Lower limit nat', lowerLimitNat);
      }
      setError(null);
      setSwapTo({
        decimal: ToValString,
        nat: swapToNat.value,
        limitDec: lowerLimitDec,
        limitNat: lowerLimitNat,
      });
    }
  };
  const handleOutputChange = ({ target }) => {
    if (asset.to && asset.from) {
      let newInput = target.value;
      if (newInput < 0) {
        newInput = 0;
      } else if (!newInput) {
        const reset = {
          decimal: undefined,
          nat: 0n,
          limitDec: 0,
          limitNat: 0n,
        };
        setSwapFrom(reset);
        setSwapTo(reset);
        return;
      }
      // parse as Nat value
      const swapToNat = parseAsNat(
        newInput,
        asset.to?.purse?.displayInfo?.decimalPlaces,
      );

      setSwapTo({ decimal: newInput, nat: swapToNat, limitNat: 0n });
      setSwapType(SWAP_OUT);
      // agoric stuff
      const amountMakeTo = AmountMath.make(asset.to?.brand, swapToNat);

      // calculate swapFrom price
      // multiply userInput 'to' amount to 'from' amount using provided rate.
      const swapFromNat = floorMultiplyBy(
        amountMakeTo,
        invertRatio(assetExchange.marketRate),
      );
      // convert bigInt to int, seems extra but doing it for consistent decimal places
      const FromValString = stringifyNat(
        swapFromNat.value,
        asset.from?.purse?.displayInfo?.decimalPlaces,
        PLACES_TO_SHOW,
      );

      // calculating slippage
      const slippagePerc = divide(slippage, 100);
      const slippageUnit = multiply(slippagePerc * UNIT_BASIS);
      const maxSlippageUnit = slippageUnit + UNIT_BASIS;
      const maxSlippageUnitNat = parseAsNat(maxSlippageUnit.toString(), 0);

      const upperLimitNat =
        (swapFromNat.value * maxSlippageUnitNat) / UNIT_BASIS_NAT;

      const upperLimitDec = stringifyNat(
        upperLimitNat,
        asset.from?.purse?.displayInfo?.decimalPlaces,
        PLACES_TO_SHOW,
      );

      setError(null);
      setSwapFrom({
        decimal: FromValString,
        nat: swapFromNat.value,
        limitDec: upperLimitDec,
        limitNat: upperLimitNat,
      });
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, boxShadow: 'none' }}
        animate={{
          opacity: 1,
          boxShadow: '0px 0px 99px var(--color-secondary)',
        }}
        transition={{ duration: 0.8 }}
        className="flex flex-col p-4 rounded-sm gap-4 w-screen max-w-lg relative  select-none overflow-hidden"
      >
        <motion.div className="flex justify-between items-center gap-8 " layout>
          <h1 className="text-2xl font-semibold">Swap</h1>
          <h3
            className="flex  items-center text-sm gap-2 p-1 text-gray-500 cursor-pointer hover:bg-gray-100 rounded-sm"
            onClick={() => {
              setOptionsEnabled(!optionsEnabled);
            }}
          >
            More options {optionsEnabled ? <FiChevronUp /> : <FiChevronDown />}
          </h3>
        </motion.div>

        {optionsEnabled && (
          <OptionsSwap slippage={slippage} setSlippage={setSlippage} />
        )}
        {/* {assetloader ? (
          <motion.div className="flex flex-row justify-center items-center">
            {' '}
            <Loader type="Oval" color="#62d2cb" height={60} width={60} />
          </motion.div>
        ) : ( */}
        <motion.div className="flex flex-col gap-4 relative" layout>
          <div className="flex flex-col gap-4 relative">
            <SectionSwap
              type="from"
              value={swapFrom.decimal}
              handleChange={handleInputChange}
              rateAvailable={!assetExchange?.rate}
            />
            <FiRepeat
              // className="transform-gpu rotate-90 p-1 bg-alternative text-3xl absolute left-6 ring-4 ring-white position-swap-icon cursor-pointer hover:bg-alternativeDark z-20"
              className="transform rotate-90 p-1 bg-alternative  absolute left-6 position-swap-icon cursor-pointer hover:bg-alternativeDark z-20 border-4 border-white box-border"
              size="30"
              onClick={() => {
                if (asset.to && asset.from) {
                  setAsset({
                    from: asset.to,
                    to: asset.from,
                  });
                  setSwapFrom(swapTo);
                  setSwapTo(swapFrom);
                  setAssetExchange({
                    ...assetExchange,
                    marketRate: invertRatio(assetExchange.marketRate),
                  });
                }
              }}
            />
          </div>
          <SectionSwap
            type="to"
            value={swapTo.decimal}
            handleChange={handleOutputChange}
            rateAvailable={!assetExchange?.rate}
          />
        </motion.div>
        {/* )} */}
        {!exchangeRateLoader && assetExists && assetExchange && (
          <ExtraInformation
            {...assetExchange}
            swapFrom={swapFrom}
            swapTo={swapTo}
            swapType={swapType}
          />
        )}
        {exchangeRateLoader && (
          <motion.div className="flex flex-row justify-left items-center text-gray-400">
            <Loader type="Oval" color="#62d2cb" height={15} width={15} />
            <div className="pl-2 text-lg">Fetching best price...</div>
          </motion.div>
        )}

        <motion.button
          layout
          className={clsx(
            'flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-xl  font-medium p-3  uppercase',
            (assetExists || swapped) && !error
              ? 'bg-primary hover:bg-primaryDark text-white'
              : 'text-gray-500',
          )}
          disabled={error}
          onClick={() => {
            if (Object.values(asset).filter(item => item).length < 2)
              setError('Please select assets first');
            else if (!(swapFrom && swapTo)) {
              setError('Please enter the amount first');
            } else if (swapped) {
              setError('Please wait!');
            } else {
              handleSwap();
            }
          }}
        >
          <motion.div className="relative flex-row w-full justify-center items-center">
            {swapped && swapButtonStatus === 'Swap' && (
              <Loader
                className="absolute right-0"
                type="Oval"
                color="#fff"
                height={28}
                width={28}
              />
            )}
            {swapped && swapButtonStatus === 'Swapped' && (
              <FiCheck className="absolute right-0" size={28} />
            )}
            {swapped && swapButtonStatus === 'Not Swapped' && (
              <BiErrorCircle className="absolute right-0" size={28} />
            )}
            <div className="text-white">{swapButtonStatus}</div>
          </motion.div>
        </motion.button>

        {error && (
          <motion.h3 layout className="text-red-600">
            {error}
          </motion.h3>
        )}
      </motion.div>
    </>
  );
};

export default Swap;
