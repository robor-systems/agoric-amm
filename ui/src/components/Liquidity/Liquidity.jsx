import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import AssetWrapper from 'context/AssetWrapper';
import {
  getPoolAllocationService,
  getUserLiquidityService,
} from 'services/liquidity.service';
import { useApplicationContext } from 'context/Application';
import PoolContext from 'context/PoolContext';

import { getInfoForBrand } from 'utils/helpers';

import { motion } from 'framer-motion';
import React, { useState, useEffect, useContext } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import AddLiquidity from './AddLiquidity/AddLiquidity';
import LiquidityPool from './LiquidityPool/LiquidityPool';
import RemoveLiquidity from './RemoveLiquidity/RemoveLiquidity';

const Liquidity = () => {
  const tabClasses = ({ selected }) =>
    clsx(
      'tab font-medium uppercase flex-grow',
      selected
        ? 'border-b-4 border-alternativeBright text-alternativeBright '
        : 'bg-white text-gray-400',
    );
  const [open, setOpen] = useState(false);
  const addLiquidityHook = useState({ central: null, liquidity: null });
  const removeLiquidityHook = useState({ central: null, liquidity: null });
  const [centralInfo, setCentralInfo] = useState(null);
  const [pool, setPool] = useContext(PoolContext);
  // get state
  const { state } = useApplicationContext();
  const {
    brandToInfo,
    autoswap: { ammAPI, centralBrand },
  } = state;

  useEffect(() => {
    // TODO: next step is to figure out how to get user supply.
    const getUserSupply = async () => {
      getUserLiquidityService(state.assets);
    };

    const getPool = async () => {
      const poolAllocations = await getPoolAllocationService(ammAPI);
      console.log('POOL ALLOCATIONS: ', poolAllocations);
      setPool({ ...pool, allocations: poolAllocations });
    };

    state && state.assets && getUserSupply();
    state && state.purses && getPool();

    setCentralInfo(getInfoForBrand(brandToInfo, centralBrand));
  }, [state.purses]);

  return (
    <>
      <LiquidityPool open={open} setOpen={setOpen} />
      <motion.div
        className="flex flex-col gap-2"
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button
          className="uppercase flex items-center text-sm gap-1 text-gray-500 hover:text-black"
          onClick={() => {
            setOpen(!open);
          }}
        >
          View Liquidity Positions <FiChevronRight className="text-lg" />
        </button>
        <motion.div
          className="flex flex-col p-4  rounded-sm gap-4 max-w-lg relative  select-none w-screen"
          initial={{ opacity: 0, boxShadow: 'none' }}
          animate={{
            opacity: 1,
            boxShadow: '0px 0px 99px var(--color-secondary)',
          }}
          transition={{ duration: 0.8 }}
          layout
        >
          <div className="flex flex-col justify-between  gap-2 ">
            <h1 className="text-2xl font-semibold">Liquidity</h1>
            <h2 className="text-gray-500 ">
              All liquidity pairs currently use {centralInfo?.petname}
            </h2>
          </div>
          <Tab.Group>
            <Tab.List className="bg-white  text-md  rounded-sm  flex ">
              <Tab className={tabClasses}>Add</Tab>
              <Tab className={tabClasses}>Remove</Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <AssetWrapper assetHook={addLiquidityHook}>
                  <AddLiquidity />
                </AssetWrapper>
              </Tab.Panel>
              <Tab.Panel>
                <AssetWrapper assetHook={removeLiquidityHook}>
                  <RemoveLiquidity setOpen={setOpen} />
                </AssetWrapper>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Liquidity;
