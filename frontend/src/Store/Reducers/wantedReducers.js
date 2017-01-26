import { handleActions } from 'redux-actions';
import * as types from 'Store/Actions/actionTypes';
import { sortDirections } from 'Helpers/Props';
import createClearReducer from './Creators/createClearReducer';
import createSetReducer from './Creators/createSetReducer';
import createUpdateReducer from './Creators/createUpdateReducer';
import createUpdateItemReducer from './Creators/createUpdateItemReducer';
import createUpdateServerSideCollectionReducer from './Creators/createUpdateServerSideCollectionReducer';
import createReducers from './Creators/createReducers';

export const defaultState = {
  missing: {
    isFetching: false,
    isPopulated: false,
    pageSize: 20,
    sortKey: 'airDateUtc',
    sortDirection: sortDirections.DESCENDING,
    filterKey: 'monitored',
    filterValue: true,
    error: null,
    items: []
  },

  cutoffUnmet: {
    isFetching: false,
    isPopulated: false,
    pageSize: 20,
    sortKey: 'airDateUtc',
    sortDirection: sortDirections.DESCENDING,
    filterKey: 'monitored',
    filterValue: true,
    error: null,
    items: []
  }
};

export const persistState = [
  'wanted.missing.sortKey',
  'wanted.missing.sortDirection',
  'wanted.missing.filterKey',
  'wanted.missing.filterValue',
  'wanted.cutoffUnmet.sortKey',
  'wanted.cutoffUnmet.sortDirection',
  'wanted.cutoffUnmet.filterKey',
  'wanted.cutoffUnmet.filterValue'
];

const serverSideCollectionNames = [
  'missing',
  'cutoffUnmet'
];

const wantedReducers = handleActions({

  [types.SET]: createReducers(serverSideCollectionNames, createSetReducer),
  [types.UPDATE]: createReducers(serverSideCollectionNames, createUpdateReducer),
  [types.UPDATE_ITEM]: createReducers(serverSideCollectionNames, createUpdateItemReducer),
  [types.UPDATE_SERVER_SIDE_COLLECTION]: createReducers(serverSideCollectionNames, createUpdateServerSideCollectionReducer),

  [types.CLEAR_MISSING]: createClearReducer('missing', {
    isFetching: false,
    isPopulated: false,
    error: null,
    items: []
  }),

  [types.CLEAR_CUTOFF_UNMET]: createClearReducer('cutoffUnmet', {
    isFetching: false,
    isPopulated: false,
    error: null,
    items: []
  })

}, defaultState);

export default wantedReducers;
