import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import React, { useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import AddLiquidity from './AddLiquidity/AddLiquidity';
import LiquidityPool from './LiquidityPool/LiquidityPool';

const Liquidity = () => {
  const tabClasses = ({ selected }) =>
    clsx(
      'tab font-medium uppercase flex-grow',
      selected
        ? 'border-b-4 border-alternativeBright text-alternativeBright '
        : 'bg-white text-gray-400',
    );
  const [open, setOpen] = useState(false);

  return (
    <>
      <LiquidityPool open={open} setOpen={setOpen} />
      <div className="flex flex-col gap-2">
        <button
          className="uppercase flex items-center text-sm gap-1 text-gray-500 hover:text-black"
          onClick={() => {
            setOpen(!open);
          }}
        >
          View Liquidity Positions <FiChevronRight className="text-lg" />
        </button>
        <div className=" flex flex-col p-4 shadow-red-light  rounded-sm gap-4 w-full max-w-lg relative  select-none">
          <div className="flex flex-col justify-between  gap-2 ">
            <h1 className="text-2xl font-semibold">Liquidity</h1>
            <h2 className="text-gray-500 ">
              All Liquidity pairs currently use RUN
            </h2>
          </div>
          <Tab.Group>
            <Tab.List className="bg-white  text-md  rounded-sm  flex">
              <Tab className={tabClasses}>Add</Tab>
              <Tab className={tabClasses}>Remove</Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <AddLiquidity />
              </Tab.Panel>
              <Tab.Panel>
                <AddLiquidity />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </>
  );
};

export default Liquidity;
