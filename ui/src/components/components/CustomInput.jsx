import { useApplicationContext } from 'context/Application';
import { set } from 'lodash';
import React, { useState, useEffect,useMemo } from 'react';

function CustomInput({
  value,
  handleChange,
  asset,
  type,
  rateAvailable,
  useCase,
}) {
  const { state } = useApplicationContext();
  const { assets } = state;
  const [balance, setBalance] = useState(asset[type]?.purse?.balance);
  const onMax = () => {
    asset[type] &&
      handleChange({ target: { value: asset[type].purse.balance } });
  };
  const purseBalance = useMemo(() => {
    let obj = {};
    let exit=0;
    assets.forEach(assetobj => {
      if(exit)return;
      assetobj.purses.forEach(cpurse => {
        if (exit) return;
        if (cpurse.name === asset[type]?.purse.name) { 
          obj = cpurse;
          exit = 1;
        }
            
      })
    })
    return obj.balance; 
  }, [assets]);
  useEffect(() => {
    asset[type]?.purse?.balance && !purseBalance?setBalance( asset[type]?.purse?.balance):setBalance(purseBalance)
  }, [assets,asset[type]]);
  return (
    <div className="relative flex-grow">
      {asset[type]?.purse && (
        <div className="absolute top-3 left-3">
          {' '}
          <button
            className={
              'bg-transparent hover:bg-gray-100 text-[#3BC7BE] font-semibold py-[3px] px-1 border border-[#3BC7BE] rounded text-xs leading-3'
    
            }
            disabled={rateAvailable}
            onClick={onMax}
          >
            Max
          </button>
        </div>
      )}
      <input
        type="number"
        placeholder="0.0"
        value={value}
        onChange={handleChange}
        className={`rounded-sm bg-white bg-opacity-100 text-xl p-3 leading-6 w-full hover:outline-none focus:outline-none border-none ${
          asset[type]?.purse ? 'pl-[52px]' : 'pl-[12px]'
        }`}
        disabled={
          useCase === 'swap'
            ? rateAvailable || !asset.to || !asset.from
            : rateAvailable || !asset.central || !asset.secondary
        }
        min="0"
        max="10000000"
      />
      {asset[type]?.purse && (
        <div className="absolute right-3 top-1 text-gray-400 flex flex-col text-right text-sm bg-white">
          <div>Balance: {balance}</div>
          <div>~ ${asset[type].purse.balanceUSD}</div>
        </div>
      )}
    </div>
  );
}

export default CustomInput;
