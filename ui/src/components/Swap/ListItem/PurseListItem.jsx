import React from 'react';

const PurseListItem = ({ name, balance, balanceUSD }) => {
  return (
    <div className="flex gap-3 items-center justify-between w-full">
      <h3 className="text-md font-medium">{name}</h3>
      <div className="text-right">
        <h4 className="text-sm text-gray-500">Balance: {balance}</h4>
        <h4 className="text-sm text-gray-500">~ ${balanceUSD}</h4>
      </div>
    </div>
  );
};

export default PurseListItem;
