import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ApplicationContextProvider from 'context/Application';

ReactDOM.render(
  <ApplicationContextProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApplicationContextProvider>,
  document.getElementById('root'),
);
