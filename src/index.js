import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import { SeatProvider } from './components/SeatContext';

const rootElement = document.getElementById('root');

ReactDOM.render(
  <SeatProvider>
        <App />
  </SeatProvider>,
  rootElement);
