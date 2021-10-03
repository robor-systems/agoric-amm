import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import React from 'react';
import AddLiquidity from './AddLiquidity/AddLiquidity';

const Liquidity = () => {
  const tabClasses = ({ selected }) =>
    clsx(
      'tab font-medium uppercase flex-grow',
      selected
        ? 'border-b-4 border-alternativeBright text-alternativeBright '
        : 'bg-white text-gray-400',
    );

  return (
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
            {' '}
            <AddLiquidity />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Liquidity;
