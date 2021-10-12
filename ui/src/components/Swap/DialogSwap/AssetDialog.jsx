import _ from 'lodash';
import { useApplicationContext } from 'context/Application';
import AssetContext from 'context/AssetContext';
import React, { useContext } from 'react';
import { v4 } from 'uuid';
import AssetListItem from '../ListItem/AssetListItem';
import ListItem from '../ListItem/ListItem';
import SkeletonListItem from '../ListItem/SkeletonListItem';

const AssetDialog = ({ type, setSelectedAsset }) => {
  // selected asset
  const [asset] = useContext(AssetContext);
  // get state
  const { state } = useApplicationContext();

  // get assets from
  let { assets } = state;

  const {
    autoswap: { centralBrand },
  } = state;

  // if type liquidity then we don't want to show centralBrand
  if (type === 'liquidity') {
    assets = assets.filter(item => {
      return item.brand !== centralBrand;
    });
  }

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
          key={v4()}
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
