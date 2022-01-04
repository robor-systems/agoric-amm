import React from "react";
import { ToastContainer } from "react-toastify";

function InformationToast() {
  return (
    <div>
      <ToastContainer
        enableMultiContainer
        containerId={"Info"}
        className="overflow-hidden invisible md:visible right-14 top-[150px] z-10"
        position={"top-right"}
        closeOnClick={false}
        newestOnTop={true}
        hideProgressBar={true}
        progress={false}
        autoClose={false}
      ></ToastContainer>
    </div>
  );
}

export default InformationToast;
