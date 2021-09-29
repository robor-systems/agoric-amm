import React from 'react';
import { useState } from 'react';
import AssetContext from './AssetContext';

const AssetWrapper = ({ children }) => {
  const assetHook = useState({ from: null, to: null });
  return (
    <AssetContext.Provider value={assetHook}>{children}</AssetContext.Provider>
  );
};

export default AssetWrapper;
