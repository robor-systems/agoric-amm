import _ from 'lodash';
import { useApplicationContext } from 'context/Application';
import AssetContext from 'context/AssetContext';
import React, { useContext, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { getAssets } from 'utils/helpers';
import AssetListItem from '../ListItem/AssetListItem';
import ListItem from '../ListItem/ListItem';
import SkeletonListItem from '../ListItem/SkeletonListItem';

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

  if (!assets.length)
    return (
      <div className="flex flex-col gap-4 p-5 overflow-auto ">
        {Array(4)
          .fill({})
          .map(item => (
            <ListItem key={v4()}>
              <SkeletonListItem />
            </ListItem>
          ))}
      </div>
    );

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
