import React, { useEffect } from 'react';
import { useApplicationContext } from '../../context/Application';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiCheckCircle } from 'react-icons/fi';
import { IoRadioOutline } from 'react-icons/io5';
function ApprovalToast() {
  const toastId = React.useRef(null);
  const dismiss = () => toast.dismiss(toastId.current);
  const { state } = useApplicationContext();
  const { approved } = state;
  const properties = {
    position: 'top-right',
    hideProgressBar: true,
    closeOnClick: true,
    newestOnTop: true,
    draggable: false,
    progress: false,
    containerId: 'Wallet',
  };
  useEffect(() => {
    console.log('executing wallet plugin');
    if (state) {
      dismiss();
      if (approved)
        toastId.current = toast(
          <div className="flex flex-row items-center">
            <div className="p-[6px] bg-[#E8F8F7]">
              <FiCheckCircle color="red" size={20} />
            </div>
            <div className="font-[16px] pl-4">DAPP Connected</div>
          </div>,
          properties,
        );
      else
        toastId.current = toast(
          <div className="flex flex-row items-center">
            <div className="p-[6px] bg-[#E8F8F7]">
              <FiCheckCircle color="red" size={20} />
            </div>
            <div className="font-[16px] pl-4">
              Enable DAPP in wallet to continue
            </div>
          </div>,
          properties,
        );
    }
  }, [approved]);
  return <></>;
}

export default ApprovalToast;
