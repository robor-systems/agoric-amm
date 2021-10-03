import assets from 'services/assets.service';
import AssetContext from 'context/AssetContext';
import React, { useContext } from 'react';
import AssetListItem from '../ListItem/AssetListItem';
import ListItem from '../ListItem/ListItem';

const AssetDialog = ({ type }) => {
  const [asset, setAsset] = useContext(AssetContext);

  return (
    <div className="flex flex-col gap-4 p-5 overflow-auto ">
      {assets.map(item => (
        <div
          key={item.id}
          onClick={() => {
            setAsset({
              ...asset,
              [type]: item,
            });
          }}
        >
          <ListItem>
            <AssetListItem {...item} />
          </ListItem>
        </div>
      ))}
    </div>
  );
};

export default AssetDialog;
