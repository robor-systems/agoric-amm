import React from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import BodyLiquidityPool from './BodyLiquidityPool';

const LiquidityPool = ({ open, setOpen }) => {
  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 w-screen  h-screen bg-black bg-opacity-10 flex items-center justify-end z-50">
      <div
        className="absolute w-full h-full "
        onClick={() => {
          setOpen(false);
        }}
      />
      <div className="bg-white w-96 h-screen shadow-red-light-sm z-50 overflow-auto">
        <button
          className="uppercase flex items-center text-sm font-medium gap-1 text-black hover:bg-gray-100 p-1 m-3 "
          onClick={() => {
            setOpen(!open);
          }}
        >
          <FiChevronLeft className="text-xl text-primary" />
          Close Liquidity Positions
        </button>
        <BodyLiquidityPool handleClose={() => setOpen(false)} />
      </div>
    </div>
  );
};

export default LiquidityPool;
