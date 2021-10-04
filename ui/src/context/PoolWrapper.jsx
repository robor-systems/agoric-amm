import React, { useState } from 'react';

import PoolContext from './PoolContext';

const PoolWrapper = ({ children }) => {
  const poolHook = useState([]);
  return (
    <PoolContext.Provider value={poolHook}>{children}</PoolContext.Provider>
  );
};

export default PoolWrapper;
