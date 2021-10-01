import AssetContext from 'context/AssetContext';
import React, { useContext, useState } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import ListItem from '../ListItem/ListItem';
import PurseListItem from '../ListItem/PurseListItem';

const PurseDialog = ({ handleClose, type }) => {
  const [asset, setAsset] = useContext(AssetContext);
  const {
    [type]: { image, name, code, balance, balanceUSD, purses },
  } = asset;

  return (
    <>
      <button
        className="uppercase  font-medium flex gap-1 hover:bg-gray-100 p-1 m-3 w-max"
        onClick={() => setAsset({ ...asset, [type]: null })}
      >
        <FiChevronLeft className="text-xl text-primary" />
        <div className="text-sm"> Go back to asset List</div>
      </button>
      <div className="flex gap-3 items-center justify-between w-full border-b px-5 pb-3">
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
      <div className="px-5 py-3">
        <h2 className="text-lg font-medium ">Select Purse</h2>
        <p className="text-gray-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem fugit,
          reprehenderit
        </p>
      </div>

      <div className="flex flex-col px-5 pb-5 gap-4 overflow-auto">
        {purses.map(purse => (
          <div
            key={purse.id}
            onClick={() => {
              setAsset({
                ...asset,
                [type]: { ...asset[type], purse },
              });
              handleClose();
            }}
          >
            <ListItem>
              <PurseListItem {...purse} />
            </ListItem>
          </div>
        ))}
      </div>
    </>
  );
};

export default PurseDialog;
