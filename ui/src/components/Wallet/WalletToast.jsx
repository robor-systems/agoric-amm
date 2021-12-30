import React, { useEffect} from 'react';
import ApprovalToast from './ApprovalToast';
import ConnectionToast from './ConnectionToast';
import { ToastContainer } from 'react-toastify';
import { IoCloseOutline } from 'react-icons/io5';

function WalletToast() {
  const closeButton = ({ closeToast }) => (
    <div onClick={closeToast} className="flex items-center">
      <IoCloseOutline size={20} />
    </div>
  );

  return (
    <div >
      <ApprovalToast />
      <ConnectionToast />
      <ToastContainer
        enableMultiContainer
        containerId={'Wallet'}
        className="min-h-[40px] z-10 top-[26px] right-[15%] sm:right-[25%] md:right-[30%] mt-0 lg:right-20 top-[24px]"
        toastClassName="p-1 pr-3 min-h-[40px] border-[1px] border-[#3BC7BE] flex-auto"
        bodyClassName="p-0 flex items-center flex-auto"
        position={'top-center'}
        closeOnClick={false}
        newestOnTop={true}
        hideProgressBar={true}
        progress={false}
        autoClose={false}
        closeButton={closeButton}
      ></ToastContainer>
    </div>
  );
}

export default WalletToast;
