import React from 'react';
import AssetContext from 'context/AssetContext';
import { useContext } from 'react';

const AssetListItem = ({ name, code, balance, image }) => {
  return (
    <div className='flex gap-3 items-center justify-between w-full'>
      <div className='flex gap-3 items-center'>
        <div className='w-10 h-10 rounded-full'>
          <img src={image} alt={name} />
        </div>

        <div className='flex flex-col'>
          <h3 className='uppercase font-semibold'>{code}</h3>
          <h4 className='text-sm text-gray-500'>{name}</h4>
        </div>
      </div>
      <h4 className='text-sm text-gray-500'>Balance: {balance}</h4>
    </div>
  );
};

export default AssetListItem;
