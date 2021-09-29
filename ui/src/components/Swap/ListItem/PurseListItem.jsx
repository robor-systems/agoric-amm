import React, { useContext } from 'react';
import AssetContext from 'context/AssetContext';

const PurseListItem = ({ name, balance, handleClose, ...props }) => {
  const [asset, setAsset] = useContext(AssetContext);

  return (
    <div className="flex gap-3 items-center justify-between w-full">
      <h3 className="text-md font-medium">{name}</h3>
      <h4 className="text-sm text-gray-500">Balance: {balance}</h4>
    </div>
  );
};

export default PurseListItem;
