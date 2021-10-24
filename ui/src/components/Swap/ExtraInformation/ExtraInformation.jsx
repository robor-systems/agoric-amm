import { motion } from 'framer-motion';
import React from 'react';

const SWAP_IN = 'IN';
const SWAP_OUT = 'OUT';

const ExtraInformation = ({ want, rate, give, swapFrom, swapTo, swapType }) => {
  return (
    <motion.div className="flex flex-col" layout>
      <div className="flex gap-4 text-gray-400 justify-between">
        Exchange Rate
        <div>
          1 {want.code} = {rate} {give.code}
        </div>
      </div>
      {swapType === SWAP_IN ? (
        <div className="flex gap-4 text-gray-400 justify-between">
          Receive at least:
          <div>
            {swapTo.limitDec} {want.code}
          </div>
        </div>
      ) : (
        <div className="flex gap-4 text-gray-400 justify-between">
          Give at most:
          <div>
            {swapFrom.limitDec} {want.code}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ExtraInformation;