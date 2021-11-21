import React from 'react';

import ErrorContext from './ErrorContext';

const ErrorWrapper = ({ children, errorHook }) => {
  return (
    <ErrorContext.Provider value={errorHook}>{children}</ErrorContext.Provider>
  );
};

export default ErrorWrapper;
