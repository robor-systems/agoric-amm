import React, { useEffect, useState } from "react";
import { useApplicationContext } from "../../context/Application";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCheckCircle } from "react-icons/fi";
import { IoRadioOutline } from "react-icons/io5";

function ConnectionToast() {
  const [Id, setId] = useState("disconnected");
  const { state } = useApplicationContext();
  const { connected } = state;
  const component = (
    <div className="flex flex-row items-center">
      <div className="p-[6px] bg-[#E8F8F7]">
        <FiCheckCircle color="#d73252" size={20} />
      </div>
      <div className="font-[16px] px-4">Wallet Connected</div>
    </div>
  );
  const component2 = (
    <div className="flex flex-row items-center">
      <div className="p-[6px] bg-[#E8F8F7]">
        <IoRadioOutline color="#d73252" size={20} />
      </div>
      <div className="font-[16px] px-4">Wallet connecting...</div>
    </div>
  );
  const properties = {
    position: "top-right",
    hideProgressBar: true,
    closeOnClick: false,
    newestOnTop: true,
    draggable: false,
    progress: false,
    containerId: "Wallet",
    pending: false
  };
  useEffect(() => {
    if (state) {
      if (connected) {
        setId(Id);
        toast.update(Id, {
          ...properties,
          render: component
        });
      } else {
        if (toast.isActive(Id)) {
          setId(Id);
          toast.update(Id, {
            ...properties,
            render: component2
          });
        } else {
          setId(
            toast(
              <div className="flex flex-row items-center">
                <div className="p-[6px] bg-[#E8F8F7]">
                  <IoRadioOutline color="#d73252" size={20} />
                </div>
                <div className="font-[16px] px-4">Wallet connecting...</div>
              </div>,
              properties
            )
          );
        }
      }
    }
  }, [connected]);
  return <></>;
}

export default ConnectionToast;
