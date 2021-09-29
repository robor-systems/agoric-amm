import React, { useContext } from 'react';
import assets from 'services/assets.service';
import AssetContext from 'context/AssetContext';
import ListItem from '../ListItem/ListItem';
import AssetListItem from '../ListItem/AssetListItem';

const AssetDialog = () => {
  const [asset, setAsset] = useContext(AssetContext);

  return (
    <div className="flex flex-col gap-4 p-5 overflow-auto ">
      {assets.map(item => (
        <div
          key={item.id}
          onClick={() => {
            setAsset({
              ...asset,
              from: item,
            });
          }}
        >
          <ListItem key={item.id}>
            <AssetListItem {...item} />
          </ListItem>
        </div>
      ))}
    </div>
  );
};

export default AssetDialog;
