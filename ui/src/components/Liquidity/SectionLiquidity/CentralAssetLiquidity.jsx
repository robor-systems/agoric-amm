import React, { useEffect, useState, useContext } from 'react';

import placeholderAgoric from 'assets/placeholder-agoric.png';

import AssetContext from 'context/AssetContext';
import { FiChevronDown } from 'react-icons/fi';

import { centralAsset } from 'services/liquidity.service';
import { assetState } from 'utils/constant';
import DialogSwap from 'components/Swap/DialogSwap/DialogSwap';

const CentralAssetLiquidity = ({ type, value, handleChange }) => {
  const [open, setOpen] = useState(false);

  const [asset, setAsset] = useContext(AssetContext);
  const selected = asset[type];

  useEffect(() => {
    const purseLength = centralAsset.purses?.length;
    const assetMode = !purseLength
      ? assetState.EMPTY
      : purseLength === 1
      ? assetState.SINGLE
      : assetState.MULTIPLE;
    setAsset({
      ...asset,
      central: {
        ...centralAsset,
        purse: assetMode == assetState.SINGLE && centralAsset.purses[0],
        mode: !purseLength
          ? assetState.EMPTY
          : purseLength === 1
          ? assetState.SINGLE
          : assetState.MULTIPLE,
      },
    });
  }, [centralAsset]);

  return (
    <>
      <DialogSwap handleClose={() => setOpen(false)} open={open} type={type} />
      <div className="flex flex-col bg-alternative p-4 rounded-sm gap-2 select-none">
        <h3 className="text-xs uppercase text-gray-500 tracking-wide font-medium select-none">
          Input
        </h3>
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-full bg-gray-500">
            <img src={selected?.image || placeholderAgoric} />
          </div>
          {selected?.mode === assetState.SINGLE ? (
            <div className="flex flex-col w-28  p-1 rounded-sm">
              <div className="flex  items-center justify-between">
                <h2 className="text-xl uppercase font-medium">
                  {selected.code}
                </h2>
              </div>
              <h3 className="text-xs text-gray-500 font-semibold">
                Purse: <span>{selected.purse.name}</span>{' '}
              </h3>
            </div>
          ) : selected?.mode === assetState.EMPTY ? (
            <div className="flex flex-col w-28    p-1 rounded-sm">
              <div className="flex  items-center justify-between">
                <h2 className="text-xl uppercase font-medium">
                  {selected.code}
                </h2>
              </div>
              <h3 className="text-xs text-gray-500 font-semibold">No Purses</h3>
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
          )}
          <div className="relative flex-grow">
            <input
              type="number"
              placeholder="0.0"
              value={value}
              disabled={selected?.mode === assetState.EMPTY}
              onChange={handleChange}
              className="input-primary w-full"
            />
            {asset[type]?.purse && (
              <div className="absolute right-3 top-1.5 text-gray-400 flex flex-col text-right text-sm bg-white">
                <div>Balance: {asset[type].purse.balance}</div>
                <div>~ ${asset[type].purse.balanceUSD}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CentralAssetLiquidity;
