import clsx from 'clsx';
import React from 'react';
import { FiArrowDown } from 'react-icons/fi';
import AmountToRemove from './AmountToRemove';
import PoolSelector from './PoolSelector/PoolSelector';
import PursesRemovePool from './PursesRemovePool/PursesRemovePool';

const RemoveLiquidity = props => {
  return (
    <div className="flex flex-col  relative gap-4">
      <PoolSelector {...props} />
      <AmountToRemove />
      <FiArrowDown className=" p-2 bg-alternative text-3xl absolute left-6  ring-4 ring-white position-swap-icon-remove" />
      <PursesRemovePool />
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
