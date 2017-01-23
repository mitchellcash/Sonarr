import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import reducers, { defaultState } from 'Store/Reducers';
import persistState from 'Store/Middleware/persistState';

function createAppStore() {
  const middlewares = compose(
    applyMiddleware(
      routerMiddleware(browserHistory),
      thunk
    ),
    persistState
  );

  const appStore = createStore(
    reducers,
    defaultState,
    middlewares
  );

  return appStore;
}

export default createAppStore;
