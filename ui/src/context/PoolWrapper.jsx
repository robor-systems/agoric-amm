import React, { useState } from 'react';
import PoolContext from './PoolContext';

const PoolWrapper = ({ children }) => {
  const poolHook = useState({ data: [], selectRemove: null, selectEdit: null });
  return (
    <PoolContext.Provider value={poolHook}>{children}</PoolContext.Provider>
  );
};

export default PoolWrapper;
