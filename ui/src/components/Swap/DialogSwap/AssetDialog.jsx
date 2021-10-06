// import assets from 'services/assets.service';
import { useApplicationContext } from 'context/Application';
import AssetContext from 'context/AssetContext';
import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash';

import { getAssets } from 'utils/helpers';

import AssetListItem from '../ListItem/AssetListItem';
import ListItem from '../ListItem/ListItem';

const AssetDialog = ({ type }) => {
  // selected asset
  const [asset, setAsset] = useContext(AssetContext);
  // all assets
  const [assets, setAssets] = useState([]);

  const { state } = useApplicationContext();
  // get purses
  const { purses } = state;

  useEffect(() => {
    const filteredPurses = purses?.filter(
      purse => purse.displayInfo.assetKind !== 'set',
    );

    setAssets([...getAssets(filteredPurses)]);
  }, [purses]);

  useEffect(() => {
    console.log(asset);
  }, [asset]);

  // TODO(ahmed): return a skeleton loader here please
  if (!assets)
    return {
      // return a loader
    };

  return (
    <div className="flex flex-col gap-4 p-5 overflow-auto ">
      {assets.map(item => (
        <div
          key={item.key}
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
