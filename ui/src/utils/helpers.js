import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import agoricLogo from 'assets/crypto-icons/agoric-logo.png';
import bldLogo from 'assets/crypto-icons/bld-logo.png';
import kirkLogo from 'assets/crypto-icons/kirk-logo.png';
import usdcLogo from 'assets/crypto-icons/usdc-logo.png';

/**
 * gets filtered array of purses
 *
 * @param {Array} purses
 * @returns {Array}
 */
export const getAssets = purses => {
  const filteredPurses = purses?.filter(
    purse => purse.displayInfo.assetKind !== 'set',
  );
  // used for storing intermediate response
  const interArr = [];
  filteredPurses?.forEach(purse => {
    // balances noted in bigInt, converting them using the provided decimalplaces
    const balance =
      Number(purse.currentAmount?.value) /
      10 ** purse.displayInfo?.decimalPlaces;

    // if such asset already inserted
    const similarAssetIndex = interArr.findIndex(elem => {
      return elem.code === purse.brandPetname;
    });

    if (similarAssetIndex !== -1) {
      interArr[similarAssetIndex].balance += balance;

      interArr[similarAssetIndex].purses.push({
        id: uuidv4(),
        name: purse.pursePetname,
        balance,
        // cmt(danish): balance USD not available right now
        balanceUSD: undefined,
        ...purse,
      });
      // skip if already includes but add in purse
      console.log('skipping: ', purse);
      return;
    }

    // setting default image as agoric logo
    let image = agoricLogo;
    switch (purse.brandPetname) {
      case 'RUN':
        image = agoricLogo;
        break;
      case 'BLD':
        image = bldLogo;
        break;
      case 'LINK':
        image = kirkLogo;
        break;
      case 'USDC':
        image = usdcLogo;
        break;
      default:
        break;
    }

    interArr.push({
      id: uuidv4(),
      code: purse.brandPetname,
      name: purse.brandPetname,
      brand: purse.brand,
      // cmt(danish): no images defined now
      image,
      balance,
      purses: [
        {
          id: uuidv4(),
          name: purse.pursePetname,
          balance,
          // cmt(danish): balance USD not available right now
          balanceUSD: undefined,
          ...purse,
        },
      ],
    });
  });

  return interArr;
};

export const getInfoForBrand = (brandToInfo, brand) => {
  const array = brandToInfo.find(([b]) => b === brand);
  if (array) {
    return array[1];
  }
  return undefined;
};

export const setToast = (msg, type, properties) => {
  const defaultProperties = {
    position: 'top-right',
    hideProgressBar: false,
    closeOnClick: true,
    newestOnTop: true,
    pauseOnHover: false,
    draggable: false,
    progress: false,
    containerId: 'Information',
  };
  const toastProperties = properties ? properties : defaultProperties;
  let id;
  switch (type) {
    case 'loading': {
      id = toast.loading(msg, { ...toastProperties });
      break;
    }
    case 'success': {
      id = toast.success(msg, {
        ...toastProperties,
      });
      break;
    }
    case 'warning': {
      id = toast.warning(msg, {
        ...toastProperties,
      });
      break;
    }
    case 'error': {
      id = toast.error(msg, {
        ...toastProperties,
      });
      break;
    }
  }
  return id;
};

export const displayPetname = pn => (Array.isArray(pn) ? pn.join('.') : pn);
