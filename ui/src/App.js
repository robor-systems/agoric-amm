import React, { useState } from 'react';
import 'styles/globals.css';
import agoricLogo from 'assets/agoric-logo.svg';
import Swap from 'components/Swap/Swap';
import AssetWrapper from 'context/AssetWrapper';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import Liquidity from 'components/Liquidity/Liquidity';

const App = () => {
  const tabClasses = ({ selected }) =>
    clsx('tab font-medium', selected ? 'bg-alternative' : 'bg-white');
  const swapHook = useState({ from: null, to: null });
  const liquidityHook = useState({ central: null, liquidity: null });

  return (
    <div className=" min-h-screen container px-4 mx-auto  py-6 flex flex-col  items-center relative">
      <img
        src={agoricLogo}
        alt="Agoric Logo"
        className="absolute top-0 left-0  py-6  px-6 "
      />
      <Tab.Group defaultIndex={0}>
        <Tab.List className="bg-white p-2 text-md shadow-red-light-sm rounded-sm mb-28 ">
          <Tab className={tabClasses}>Swap</Tab>
          <Tab className={tabClasses}>Liquidity</Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <AssetWrapper assetHook={swapHook}>
              <Swap />
            </AssetWrapper>
          </Tab.Panel>
          <Tab.Panel>
            <AssetWrapper assetHook={liquidityHook}>
              <Liquidity />
            </AssetWrapper>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default App;
