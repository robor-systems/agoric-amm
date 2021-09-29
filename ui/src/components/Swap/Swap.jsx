import React from 'react';
import { FiSettings as SettingsIcon } from 'react-icons/fi';
import SectionSwap from './SectionSwap/SectionSwap';

const Swap = () => {
  return (
    <div className=' flex flex-col p-4 shadow-red-light rounded-sm gap-4 w-full max-w-lg'>
      <div className='flex justify-between items-center gap-8 '>
        <h1 className='text-2xl font-semibold'>Swap</h1>
        <SettingsIcon className='text-3xl hover:bg-gray-100 p-1 rounded-sm' />
      </div>
      <SectionSwap type='from' />
      <SectionSwap type='to' />
      <button
        className='btn-primary text-xl font-medium p-3 cursor-not-allowed'
        disabled
      >
        Select Assets
      </button>
    </div>
  );
};

export default Swap;
