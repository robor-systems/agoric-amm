import React, { useEffect, useState, useContext } from 'react';

import placeholderAgoric from 'assets/placeholder-agoric.png';

import AssetContext from 'context/AssetContext';
import { FiChevronDown } from 'react-icons/fi';

import { assetState } from 'utils/constant';
import DialogSwap from 'components/Swap/DialogSwap/DialogSwap';
import { useApplicationContext } from 'context/Application';
import CustomInput from 'components/components/CustomInput';

const CentralAssetLiquidity = ({
  type,
  value,
  handleChange,
  rateAvailable,
  showLoader,
}) => {
  const [open, setOpen] = useState(false);
  const [centralAsset, setCentralAsset] = useState({});

  const [asset, setAsset] = useContext(AssetContext);
  const { state } = useApplicationContext();
  const [selected, setSelected] = useState(asset[type]);

  const {
    assets,
    autoswap: { centralBrand },
  } = state;

  useEffect(() => {
    if (!showLoader) {
      const assetArr = assets?.find(item => {
        return item.brand === centralBrand;
      });
      if (assetArr) {
        setCentralAsset(assetArr);
      }
    }
  }, [assets, centralBrand]);

  useEffect(() => {
    if (!showLoader) {
      const purseLength = centralAsset?.purses?.length;
      let assetMode;

      switch (purseLength) {
        case 0:
          assetMode = assetState.EMPTY;
          break;
        case 1:
          assetMode = assetState.SINGLE;
          break;
        default:
          assetMode = assetState.MULTIPLE;
          break;
      }

      setAsset({
        ...asset,
        central: {
          ...centralAsset,
          purse: assetMode === assetState.SINGLE && centralAsset.purses[0],
          mode: assetMode,
        },
      });
    }
  }, [centralAsset]);

  useEffect(() => {
    if (!showLoader) {
      setSelected(asset[type]);
    }
  }, [asset]);

  const AssetSelector = () => {
    switch (selected?.mode) {
      case assetState.SINGLE:
        return (
          <div className="flex flex-col w-28  p-1 rounded-sm">
            <div className="flex  items-center justify-between">
              <h2 className="text-xl uppercase font-medium">{selected.code}</h2>
            </div>
            <h3 className="text-xs text-gray-500 font-semibold">
              Purse: <span>{selected.purse.name}</span>
            </h3>
          </div>
        );

      case assetState.EMPTY:
        return (
          <div className="flex flex-col w-28    p-1 rounded-sm">
            <div className="flex  items-center justify-between">
              <h2 className="text-xl uppercase font-medium">{selected.code}</h2>
            </div>
            <h3 className="text-xs text-gray-500 font-semibold">No Purses</h3>
          </div>
        );

      default:
        return selected?.purse ? (
          <div
            className="flex flex-col w-28 hover:bg-black cursor-pointer hover:bg-opacity-5 p-1 rounded-sm"
            onClick={() => {
              setOpen(true);
            }}
          >
            <div className="flex  items-center justify-between">
              <h2 className="text-xl uppercase font-medium">{selected.code}</h2>
              <FiChevronDown className="text-xl" />
            </div>
            <h3 className="text-xs text-gray-500 font-semibold">
              Purse: <span>{selected.purse.name}</span>
            </h3>
          </div>
        ) : (
          <div
            className="flex flex-col w-28  p-1 rounded-sm hover:bg-black cursor-pointer hover:bg-opacity-5"
            onClick={() => {
              setOpen(true);
            }}
          >
            <div className="flex  items-center justify-between">
              <h2 className="text-xl uppercase font-medium">
                {selected?.code}
              </h2>
            </div>
            <h3 className="text-xs text-primary font-semibold flex items-center gap-1">
              Select Purse <FiChevronDown className="text-xl" />
            </h3>
          </div>
        );
    }
  };

  return (
    <>
      <DialogSwap
        handleClose={() => setOpen(false)}
        open={open}
        type={type}
        purseOnly
        asset={centralAsset}
      />
      <div className="flex flex-col bg-alternative p-4 rounded-sm gap-2 select-none">
        <h3 className="text-xs uppercase text-gray-500 tracking-wide font-medium select-none">
          Input
        </h3>
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-full bg-gray-500">
            <img src={selected?.image || placeholderAgoric} />
          </div>
          <AssetSelector selected={selected} setOpen={setOpen} />
          <CustomInput
            value={value}
            handleChange={handleChange}
            asset={asset}
            type={type}
            rateAvailable={rateAvailable}
            useCase="liquidity"
          />
        </div>
      </div>
    </>
  );
};

export default CentralAssetLiquidity;
