import React from 'react';
import { render } from 'react-dom';
import App from './App';

import 'json5';
import './utils/installSESLockdown';

import ApplicationContextProvider from 'context/Application';

render(
  <ApplicationContextProvider>
    <App />
  </ApplicationContextProvider>,
  document.getElementById('root')
);
