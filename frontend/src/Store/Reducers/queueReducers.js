import { handleActions } from 'redux-actions';
import updateSectionState from 'Utilities/State/updateSectionState';
import { sortDirections } from 'Helpers/Props';
import * as types from 'Store/Actions/actionTypes';
import createClearReducer from './Creators/createClearReducer';
import createSetReducer from './Creators/createSetReducer';
import createUpdateReducer from './Creators/createUpdateReducer';
import createUpdateItemReducer from './Creators/createUpdateItemReducer';
import createReducers from './Creators/createReducers';
import createUpdateServerSideCollectionReducer from './Creators/createUpdateServerSideCollectionReducer';

export const defaultState = {
  queueStatus: {
    fetching: false,
    populated: false,
    error: null,
    item: {}
  },

  details: {
    fetching: false,
    populated: false,
    error: null,
    items: [],
    params: {}
  },

  paged: {
    fetching: false,
    populated: false,
    pageSize: 20,
    sortKey: 'timeleft',
    sortDirection: sortDirections.ASCENDING,
    error: null,
    items: []
  },

  episodes: {
    items: []
  }
};

export const persistState = [
  'queue.paged.sortKey',
  'queue.paged.sortDirection'
];

const propertyNames = [
  'queueStatus',
  'details',
  'episodes'
];

const paged = 'paged';

const queueReducers = handleActions({

  [types.SET]: createReducers([...propertyNames, paged], createSetReducer),
  [types.UPDATE]: createReducers([...propertyNames, paged], createUpdateReducer),
  [types.UPDATE_ITEM]: createReducers(['episodes', paged], createUpdateItemReducer),

  [types.CLEAR_QUEUE_DETAILS]: createClearReducer('details', defaultState.details),

  [types.UPDATE_SERVER_SIDE_COLLECTION]: createUpdateServerSideCollectionReducer(paged),

  [types.CLEAR_QUEUE]: createClearReducer('paged', {
    fetching: false,
    populated: false,
    error: null,
    items: []
  }),

  [types.SET_QUEUE_EPISODES]: function(state, { payload }) {
    const section = 'episodes';

    return updateSectionState(state, section, { items: payload.episodes });
  }

}, defaultState);

export default queueReducers;
