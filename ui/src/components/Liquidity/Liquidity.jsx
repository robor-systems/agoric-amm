import { Tab } from '@headlessui/react';

import clsx from 'clsx';
import {
  getPoolAllocationService,
  getUserLiquidityService,
} from 'services/liquidity.service';
import { useApplicationContext } from 'context/Application';
import PoolContext from 'context/PoolContext';
import AssetWrapper from 'context/AssetWrapper';
import ErrorWrapper from 'context/ErrorWrapper';

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
  const [assetloader, setAssetLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const liquidityHook = useState({ central: null, liquidity: null });
  const errorHook = useState(undefined);
  const [centralInfo, setCentralInfo] = useState(null);
  const [pool, setPool] = useContext(PoolContext);
  // get state
  const { state } = useApplicationContext();
  const {
    brandToInfo,
    autoswap: { ammAPI, centralBrand },
  } = state;
  useEffect(() => {
    brandToInfo.length <= 0 ? setAssetLoader(true) : setAssetLoader(false);
  }, []);
  useEffect(() => {
    const getPool = async () => {
      const poolAllocations = await getPoolAllocationService(
        ammAPI,
        state.assets,
      );
      if (poolAllocations.status === 200) {
        const { allocations } = poolAllocations;
        console.log('POOL ALLOCATIONS: ', allocations);
        const status = poolAllocations.status;
        setPool({ ...pool, allocations, allLiquidityStatus: status });
      } else {
        // TODO: should be printed on screen
        console.error('Something went wrong');
      }

      // further process userPairs to determine liquidity percentages
      console.log('poolAllocations userPairs:', poolAllocations.userPairs);
      const userLiquidity = await getUserLiquidityService(
        ammAPI,
        poolAllocations.userPairs,
      );
      if (userLiquidity.status === 200 || userLiquidity.status === 204) {
        // TODO use userPairs to show user's liquidity in the screen.
        console.log('User POOL ALLOCATIONS: ', userLiquidity.payload);
        const status = userLiquidity.status;
        setPool({
          ...pool,
          userPairs: userLiquidity.payload,
          userLiquidityStatus: status,
        });
      } else {
        // TODO: should be printed on screen
        console.error('Something went wrong');
      }
    };

    state && state.assets && getPool();
    setCentralInfo(getInfoForBrand(brandToInfo, centralBrand));
  }, [state.assets]);

  return (
    <AssetWrapper assetHook={liquidityHook}>
      <ErrorWrapper errorHook={errorHook}>
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
                  {/* {assetloader ? (
                    <motion.div className="flex flex-row justify-center items-center">
                      {' '}
                      <Loader
                        type="Oval"
                        color="#62d2cb"
                        height={60}
                        width={60}
                      />
                    </motion.div>
                  ) : ( */}
                  <AddLiquidity />
                  {/* )} */}
                </Tab.Panel>
                <Tab.Panel>
                  {/* {assetloader ? (
                    <motion.div className="flex flex-row justify-center items-center">
                      {' '}
                      <Loader
                        type="Oval"
                        color="#62d2cb"
                        height={60}
                        width={60}
                      />
                    </motion.div>
                  ) : ( */}
                  <RemoveLiquidity setOpen={setOpen} />
                  {/* )} */}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </motion.div>
        </motion.div>
      </ErrorWrapper>
    </AssetWrapper>
  );
};

export default Liquidity;
