import { FiHelpCircle } from 'react-icons/fi';
import React from 'react';
import { motion } from 'framer-motion';

const OptionsSwap = () => {
  return (
    <motion.div
      layout
      className="w-full py-1  flex justify-between items-center"
    >
      <div className="flex gap-2 items-center">
        <h2>Slippage Tolerance</h2>
        <FiHelpCircle className="p-1 text-2xl hover:bg-gray-100 rounded-full cursor-pointer" />
      </div>

      <div className="flex gap-3">
        <div className="relative">
          <input
            type="number"
            className=" p-2 focus:outline-none bg-gray-100 rounded-sm"
            placeholder="0.5"
          />
          <div className="text-lg absolute top-1.5 right-2  text-gray-400">
            %
          </div>
        </div>
        <button className="btn-primary py-2 px-4">Auto</button>
      </div>
    </motion.div>
  );
};

export default OptionsSwap;
