import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers, { defaultState } from 'Store/Reducers';
import persistState from 'Store/Middleware/persistState';


function createAppStore() {
  const middlewares = compose(
    applyMiddleware(thunk),
    persistState
  );

  const appStore = createStore(
    reducers,
    defaultState,
    middlewares
  );

  // appStore.dispatch(fetchSeries());
  // appStore.dispatch(fetchTags());
  // appStore.dispatch(fetchQualityProfiles());

  return appStore;
}

export default createAppStore;
