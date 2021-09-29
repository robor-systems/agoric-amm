import React from 'react';
import 'styles/globals.css';
import agoricLogo from 'assets/agoric-logo.svg';
import Swap from 'components/Swap/Swap';
import AssetWrapper from 'context/AssetWrapper';

const App = () => {
  return (
    <AssetWrapper>
      <div className=' min-h-screen container px-4 mx-auto  py-6 flex flex-col justify-center items-center relative'>
        <img
          src={agoricLogo}
          alt='Agoric Logo'
          className='absolute top-0 left-0  py-6  px-6 '
        />
        <Swap />
      </div>
    </AssetWrapper>
  );
};

export default App;
