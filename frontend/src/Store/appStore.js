import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers, { defaultState } from 'Store/Reducers';
import persistState from 'Store/Middleware/persistState';
import { fetchSeries } from 'Store/Actions/seriesActions';
import { fetchTags } from 'Store/Actions/tagActions';
import { fetchQualityProfiles } from 'Store/Actions/settingsActions';

const middlewares = compose(
  applyMiddleware(thunk),
  persistState
);

const appStore = createStore(
  reducers,
  defaultState,
  middlewares
);

appStore.dispatch(fetchSeries());
appStore.dispatch(fetchTags());
appStore.dispatch(fetchQualityProfiles());

export default appStore;
