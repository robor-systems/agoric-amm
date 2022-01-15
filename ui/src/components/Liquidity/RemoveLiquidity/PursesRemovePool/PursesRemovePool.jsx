import React, { useContext, useEffect, useState } from 'react';
import { useApplicationContext } from 'context/Application';
import AssetContext from 'context/AssetContext';
import { assetState } from 'utils/constant';
import PurseRemovePool from './PurseRemovePool';

const PursesRemovePool = props => {
  const [asset, setAsset] = useContext(AssetContext);

  const { state } = useApplicationContext();
  const {
    assets,
    autoswap: { centralBrand },
  } = state;

  const [centralAsset, setCentralAsset] = useState({});

  useEffect(() => {
    const assetArr = assets?.find(item => {
      return item.brand === centralBrand;
    });

    if (assetArr) {
      setCentralAsset(assetArr);
    }

    const purseLength = centralAsset?.purses?.length;
    let assetMode;

    switch (purseLength) {
      case 0:
        assetMode = assetState.EMPTY;
        break;
      case 1:
        assetMode = assetState.SINGLE;
        break;
      default:
        assetMode = assetState.MULTIPLE;
        break;
    }

    setAsset({
      ...asset,
      centralRemove: {
        ...centralAsset,
        purse: assetMode === assetState.SINGLE && centralAsset.purses[0],
        mode: assetMode,
      },
    });
  }, []);

  useEffect(() => {
    const purseLength = centralAsset?.purses?.length;
    let assetMode;

    switch (purseLength) {
      case 0:
        assetMode = assetState.EMPTY;
        break;
      case 1:
        assetMode = assetState.SINGLE;
        break;
      default:
        assetMode = assetState.MULTIPLE;
        break;
    }

    setAsset({
      ...asset,
      central: {
        ...centralAsset,
        purse: assetMode === assetState.SINGLE && centralAsset.purses[0],
        mode: assetMode,
      },
    });
  }, [centralAsset]);
  useEffect(() => {
    console.log('asset.secondaryRemove:', asset);
  }, [asset.secondaryRemove]);
  return (
    <div className="flex flex-col text-lg gap-2 bg-alternative rounded-sm p-4">
      <h3>You Will Receive</h3>
      <div className="flex gap-4">
        <PurseRemovePool pool={centralAsset} {...props} type="centralRemove" />
        <PurseRemovePool
          pool={asset.secondaryRemove}
          {...props}
          type="secondaryRemove"
        />
      </div>
    </div>
  );
};

export default PursesRemovePool;
