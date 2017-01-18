import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import appStore from './Store/appStore';
import App from './App';
import 'Styles/globals.css';
import './index.css';

const store = appStore;
const history = syncHistoryWithStore(browserHistory, store);

render(
  <App store={store} history={history} />,
  document.getElementById('root')
);
