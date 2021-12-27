import { toast } from 'react-toastify';
import React, { useRef } from 'react';

export const setToast = (msg, type, properties) => {
  const toastId = useRef(null);

  // const defaultProperties = {
  //   position: 'top-right',
  //   hideProgressBar: false,
  //   closeOnClick: true,
  //   newestOnTop: true,
  //   pauseOnHover: false,
  //   draggable: false,
  //   progress: false,
  // };
  const toastProperties = properties ? properties : defaultProperties;
  type === 'connecting' &&
    toast.loading(msg, {
      ...toastProperties,
    });
  type === 'connected' &&
    toast.success(msg, {
      ...toastProperties,
    });
  type === 'no connection' &&
    toast.warning(msg, {
      ...toastProperties,
    });
  type === 'dismiss' && toast.dismiss();
  type === 'error' &&
    toast.error(msg, {
      ...toastProperties,
    });
};
