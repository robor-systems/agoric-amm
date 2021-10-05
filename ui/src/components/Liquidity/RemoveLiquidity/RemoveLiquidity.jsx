import clsx from 'clsx';
import SectionSwap from 'components/Swap/SectionSwap/SectionSwap';
import React from 'react';
import { FiRepeat } from 'react-icons/fi';
import AmountToRemove from './AmountToRemove';
import PursesRemoveLiquidity from './PursesRemoveLiquidity';

const RemoveLiquidity = () => {
  return (
    <div className="flex flex-col  relative     w-screen max-w-md gap-4">
      <AmountToRemove />
      <FiRepeat className="transform-gpu rotate-90 p-2 bg-alternative text-3xl absolute left-6  ring-4 ring-white position-swap-icon-liquidity cursor-pointer hover:bg-alternativeDark" />
      <PursesRemoveLiquidity />
      <button
        className={clsx(
          'bg-gray-100 hover:bg-gray-200 text-xl  font-medium p-3  uppercase',
          0 ? 'bg-primary hover:bg-primaryDark text-white' : 'text-gray-500',
        )}
      >
        Confirm Withdrawal
      </button>
    </div>
  );
};

export default RemoveLiquidity;
