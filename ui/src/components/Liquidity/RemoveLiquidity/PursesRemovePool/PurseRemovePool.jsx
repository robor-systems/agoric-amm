import { useApplicationContext } from 'context/Application';
import React, { useContext, useEffect, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { getAssets } from 'utils/helpers';
import placeholderAgoric from 'assets/placeholder-agoric.png';
import AssetContext from 'context/AssetContext';
import DialogSwap from 'components/Swap/DialogSwap/DialogSwap';

const PurseRemovePool = ({ pool, type, amount }) => {
  const [assets, setAssets] = useState([]);
  const [asset] = useContext(AssetContext);
  const { state } = useApplicationContext();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setAssets([...getAssets(state.purses)]);
  }, [state.purses]);

  if (!pool)
    return (
      <div className="flex  flex-grow w-1/2 gap-3 bg-white h-18    p-3 rounded-sm items-center">
        <div className="w-10 h-10 rounded-full bg-gray-500">
          <img src={placeholderAgoric} />
        </div>

        <div className="flex flex-col flex-grow">
          <div className="flex  items-center justify-between">
            <h2 className="text-xl uppercase font-medium text-gray-500">
              EMPTY
            </h2>
          </div>

          <h3 className="text-xs  font-semibold flex items-center gap-1 text-gray-500">
            Select Purse <FiChevronDown className="text-xl" />
          </h3>
        </div>
      </div>
    );

  return (
    <>
      <DialogSwap
        handleClose={() => setOpen(false)}
        open={open}
        type={type}
        purseOnly
        asset={assets.find(item => item.code === pool.code)}
      />
      {asset[type]?.purse ? (
        <div
          className="flex  flex-grow w-1/2 gap-3 h-18 bg-white  cursor-pointer hover:bg-gray-50 p-3 rounded-sm items-center"
          onClick={() => {
            setOpen(true);
          }}
        >
          <div className="w-10 h-10  rounded-full bg-gray-500 overflow-hidden">
            <img src={pool.image} />
          </div>

          <div className="flex flex-col flex-grow">
            <div className="flex  items-center justify-between">
              <h2 className="text-xl uppercase font-medium">{pool.code}</h2>

              {amount && (
                <h2 className="text-green-600">
                  +{Number(amount * (pool.value / 100)).toPrecision(4)}
                </h2>
              )}
            </div>
            <h3 className="text-xs text-gray-500 font-semibold flex items-center gap-1">
              Purse:{' '}
              <span className="text-black ">
                {asset[type]?.purse.name
                  .split(' ')
                  .slice(0, 2)
                  .join(' ')}
              </span>
              <FiChevronDown className="text-xl" />
            </h3>
          </div>
        </div>
      ) : (
        <div
          className="flex  flex-grow w-1/2 gap-3 h-18 bg-white  cursor-pointer hover:bg-gray-50 p-3 rounded-sm items-center"
          onClick={() => {
            setOpen(true);
          }}
        >
          <div className="w-10 h-10 rounded-full bg-gray-500 overflow-hidden">
            <img src={pool.image} />
          </div>

          <div className="flex flex-col flex-grow">
            <div className="flex  items-center justify-between">
              <h2 className="text-xl uppercase font-medium">{pool.code}</h2>
            </div>

            <h3 className="text-xs text-primary font-semibold flex items-center gap-1">
              Select Purse <FiChevronDown className="text-xl" />
            </h3>
          </div>
        </div>
      )}
    </>
  );
};

export default PurseRemovePool;
