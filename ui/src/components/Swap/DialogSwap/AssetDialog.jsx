import { useApplicationContext } from 'context/Application';
import AssetContext from 'context/AssetContext';
import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash';

import { getAssets } from 'utils/helpers';

import AssetListItem from '../ListItem/AssetListItem';
import ListItem from '../ListItem/ListItem';

const AssetDialog = ({ type, setSelectedAsset }) => {
  // selected asset
  const [asset] = useContext(AssetContext);
  // all assets
  const [assets, setAssets] = useState([]);
  // get state
  const { state } = useApplicationContext();

  useEffect(() => {
    setAssets([...getAssets(state.purses)]);
  }, [state.purses]);

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
            setSelectedAsset({
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
