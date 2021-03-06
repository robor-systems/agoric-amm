import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiCheckCircle } from 'react-icons/fi';
import { IoRadioSharp } from 'react-icons/io5';
import { useApplicationContext } from '../../context/Application';

function ApprovalToast() {
  const [Id, setId] = useState('Approved');
  const { state } = useApplicationContext();
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
        <IoRadioSharp color="#d73252" size={20} />
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
    console.log('Approve Value:', state.approved);
    if (state) {
      if (state.approved) {
        if (toast.isActive(Id)) {
          console.log('Current toast if:', Id);
          toast.update(Id, {
            ...properties,
            autoClose: 3000,
            render: () => component2,
          });
        } else {
          console.log('Current toast if else:', state);
          setId(
            toast(component2, {
              ...properties,
              autoClose: 3000,
            }),
          );
        }
      } else if (toast.isActive(Id)) {
        console.log('Current toast else if:', Id);
        toast.update(Id, {
          ...properties,
          autoClose: false,
          render: () => component,
        });
      } else {
        console.log('Current toast else else:', Id);
        setId(toast(component, properties));
      }
    }
  }, [state.approved]);
  return <></>;
}

export default ApprovalToast;
