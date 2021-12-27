import React from 'react';
import ApprovalToast from './ApprovalToast';
import ConnectionToast from './ConnectionToast';
import { ToastContainer } from 'react-toastify';

function WalletToast() {
  return (
    <>
      {' '}
      <ApprovalToast />
      <ConnectionToast />
      <ToastContainer
        className="min-h-[40px]"
        toastClassName="p-1 min-h-[40px]"
        bodyClassName="p-0 "
        position={'top-right'}
        closeOnClick={true}
        containerId={'Wallet'}
        newestOnTop={true}
        hideProgressBar={true}
        progress={false}
        autoClose={false}
      ></ToastContainer>
    </>
  );
}

export default WalletToast;
