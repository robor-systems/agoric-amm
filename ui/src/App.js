import React from 'react';
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

  return (
    <AssetWrapper>
      <div className=" min-h-screen container px-4 mx-auto  py-6 flex flex-col  items-center relative">
        <img
          src={agoricLogo}
          alt="Agoric Logo"
          className="absolute top-0 left-0  py-6  px-6 "
        />
        <Tab.Group>
          <Tab.List className="bg-white p-2 text-md shadow-red-light-sm rounded-sm mb-36">
            <Tab className={tabClasses}>Swap</Tab>
            <Tab className={tabClasses}>Liquidity</Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <Swap />
            </Tab.Panel>
            <Tab.Panel>
              <Liquidity />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </AssetWrapper>
  );
};

export default App;
