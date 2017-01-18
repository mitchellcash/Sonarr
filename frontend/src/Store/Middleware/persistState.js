import _ from 'lodash';
import persistState from 'redux-localstorage';
import { persistState as addSeriesPersistState } from 'Store/Reducers/addSeriesReducers';
import { persistState as seriesIndexPersistState } from 'Store/Reducers/seriesIndexReducers';
import { persistState as seriesEditorPersistState } from 'Store/Reducers/seriesEditorReducers';
import { persistState as seasonPassPersistState } from 'Store/Reducers/seasonPassReducers';
import { persistState as calendarPersistState } from 'Store/Reducers/calendarReducers';
import { persistState as historyPersistState } from 'Store/Reducers/historyReducers';
import { persistState as blacklistPersistState } from 'Store/Reducers/blacklistReducers';
import { persistState as wantedPersistState } from 'Store/Reducers/wantedReducers';
import { persistState as settingsPersistState } from 'Store/Reducers/settingsReducers';
import { persistState as systemPersistState } from 'Store/Reducers/systemReducers';
import { persistState as manualImportPersistState } from 'Store/Reducers/manualImportReducers';

function slicer(paths) {
  return (state) => {
    const subset = {};

    paths.forEach((path) => {
      _.set(subset, path, _.get(state, path));
    });

    return subset;
  };
}

function serialize(obj) {
  return JSON.stringify(obj, null, 2);
}

function merge(initialState, persistedState) {
  const result = persistedState ? _.merge(initialState, persistedState) : initialState;

  return result;
}

const paths = [
  ...addSeriesPersistState,
  ...seriesIndexPersistState,
  ...seriesEditorPersistState,
  ...seasonPassPersistState,
  ...calendarPersistState,
  ...historyPersistState,
  ...blacklistPersistState,
  ...wantedPersistState,
  ...settingsPersistState,
  ...systemPersistState,
  ...manualImportPersistState
];

const config = {
  slicer,
  serialize,
  merge,
  key: 'sonarr'
};

export default persistState(paths, config);
