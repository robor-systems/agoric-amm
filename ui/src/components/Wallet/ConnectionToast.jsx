import React, { useEffect, useRef } from 'react';
import { useApplicationContext } from '../../context/Application';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiCheckCircle } from 'react-icons/fi';
import { IoRadioOutline } from 'react-icons/io5';

function ConnectionToast() {
  let toastId = useRef(null);
  const dismiss = () => toast.dismiss(toastId.current);
  const { state } = useApplicationContext();
  const { connected } = state;
  const properties = {
    position: 'top-right',
    hideProgressBar: true,
    closeOnClick: true,
    newestOnTop: true,
    draggable: false,
    progress: false,
    containerId: 'Wallet',
    pending: false,
    // toastId: 'connection',
  };
  useEffect(() => {
    if (state) {
      dismiss();
      if (connected)
        toastId.current = toast(
          <div className="flex flex-row items-center">
            <div className="p-[6px] bg-[#E8F8F7]">
              <FiCheckCircle color="red" size={20} />
            </div>
            <div className="font-[16px] pl-4">Wallet Connected</div>
          </div>,
          properties,
        );
      else
        toastId.current = toast(
          <div className="flex flex-row items-center">
            <div className="p-[6px] bg-[#E8F8F7]">
              <IoRadioOutline color="red" size={20} />
            </div>
            <div className="font-[16px] pl-4">Wallet connecting...</div>
          </div>,
          properties,
        );
    }
  }, [connected]);
  return <></>;
}

export default ConnectionToast;
