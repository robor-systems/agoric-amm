import React from 'react';

const AssetListItem = ({ name, code, balance, image, balanceUSD }) => {
  return (
    <div className="flex gap-3 items-center justify-between w-full">
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 rounded-full">
          <img src={image} alt={name} />
        </div>

        <div className="flex flex-col">
          <h3 className="uppercase font-semibold">{code}</h3>
          <h4 className="text-sm text-gray-500">{name}</h4>
        </div>
      </div>
      <div className="text-right">
        <h4 className="text-sm text-gray-500">Balance: {balance}</h4>
        <h4 className="text-sm text-gray-500">~ ${balanceUSD}</h4>
      </div>
    </div>
  );
};

export default AssetListItem;
