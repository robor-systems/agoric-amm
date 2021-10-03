import React from 'react';

import AssetContext from './AssetContext';

const AssetWrapper = ({ children, assetHook }) => {
  return (
    <AssetContext.Provider value={assetHook}>{children}</AssetContext.Provider>
  );
};

export default AssetWrapper;
