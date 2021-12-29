import React, { useEffect, useState } from 'react';
import { useApplicationContext } from '../../context/Application';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiCheckCircle } from 'react-icons/fi';
import { IoRadioOutline } from 'react-icons/io5';
function ApprovalToast() {
  const [Id, setId] = useState('Approved');
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
  const component = (
    <div className="flex flex-row items-center">
      <div className="p-[6px] bg-[#E8F8F7]">
        <IoRadioOutline color="#d73252" size={20} />
      </div>
      <div className="font-[16px] px-4"> Enable DAPP in wallet to continue</div>
    </div>
  );
  const component2 = (
    <div className="flex flex-row items-center">
      <div className="p-[6px] bg-[#E8F8F7]">
        <FiCheckCircle color="#d73252" size={20} />
      </div>
      <div className="font-[16px] px-4">DAPP Connected</div>
    </div>
  );

  useEffect(() => {
    console.log('Approve Value:', approved);
    if (state) {
      if (approved) {
        if (toast.isActive(Id)) {
          console.log('Current toast if:', Id);
          setId(Id);
          toast.update(Id, {
            ...properties,
            render: () => component2,
          });
        } else {
          console.log('Current toast if else:', Id);
          setId(toast(component2, properties));
        }
      } else {
        
        if (toast.isActive(Id)) {
          console.log('Current toast else if:', Id);
          setId(Id);
          toast.update(Id, {
            ...properties,
            render: () => component,
          });
        } else {
          console.log('Current toast else else:', Id);
          setId(toast(component, properties));
        }
      }
    }
  }, [approved]);
  return <></>;
}

export default ApprovalToast;
