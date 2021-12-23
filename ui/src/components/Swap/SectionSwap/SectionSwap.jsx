import React, { useState, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import placeholderAgoric from 'assets/placeholder-agoric.png';
import AssetContext from 'context/AssetContext';
import { FiChevronDown } from 'react-icons/fi';
import DialogSwap from '../DialogSwap/DialogSwap';

const SectionSwap = ({ type, value, handleChange, rateAvailable }) => {
  const [open, setOpen] = useState(false);

  const [asset] = useContext(AssetContext);
  const selected = asset[type];
  const onMax = () => {
    asset[type] &&
      handleChange({ target: { value: asset[type].purse.balance } });
  };
  console.log('open', open);

  return (
    <>
      <DialogSwap handleClose={() => setOpen(false)} open={open} type={type} />

      <motion.div
        className="flex flex-col bg-alternative p-4 rounded-sm gap-2 select-none"
        layout
      >
        <h3 className="text-xs uppercase text-gray-500 tracking-wide font-medium select-none">
          Swap {type.toUpperCase()}
        </h3>
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-full bg-gray-500">
            <img src={selected?.image || placeholderAgoric} />
          </div>
          {selected?.purse ? (
            <div
              className="flex flex-col w-28 hover:bg-black cursor-pointer hover:bg-opacity-5 p-1 rounded-sm"
              onClick={() => {
                setOpen(true);
              }}
            >
              <div className="flex  items-center justify-between">
                <h2 className="text-xl uppercase font-medium">
                  {selected.code}
                </h2>
                <FiChevronDown className="text-xl" />
              </div>
              <h3 className="text-xs text-gray-500 font-semibold">
                Purse: <span>{selected.purse.name}</span>{' '}
              </h3>
            </div>
          ) : (
            <button
              className="btn-primary text-sm py-1 px-2 w-28"
              onClick={() => setOpen(true)}
            >
              Select asset
            </button>
          )}
          <div className="relative flex-grow">
            {/* <div>
              <button className="absolute top-3 left-3 bg-transparent text-[#6dd] py-2 px-4 border border-[#62d2cb] rounded-md w-8 h-2 text-xs">
                MAX
              </button>
            </div> */}
            <div className="absolute top-3 left-3">
              {' '}
              <button
                className="bg-transparent hover:bg-gray-100 text-[#3BC7BE] font-semibold py-[3px] px-1 border border-[#3BC7BE] rounded text-xs leading-3 font-"
                disabled={rateAvailable}
                onClick={onMax}
              >
                Max
              </button>
            </div>
            <input
              type="number"
              placeholder="0.0"
              value={value}
              onChange={handleChange}
              className="rounded-sm bg-white bg-opacity-100 text-xl p-3 pl-[52px] leading-6 w-full hover:outline-none focus:outline-none border-none"
              disabled={rateAvailable}
              min="0"
              max="10000000"
            />
            {asset[type]?.purse && (
              <div className="absolute right-3 top-1 text-gray-400 flex flex-col text-right text-sm bg-white">
                <div>Balance: {asset[type].purse.balance}</div>
                <div>~ ${asset[type].purse.balanceUSD}</div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SectionSwap;
