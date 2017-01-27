import { handleActions } from 'redux-actions';
import * as types from 'Store/Actions/actionTypes';
import { sortDirections } from 'Helpers/Props';
import createClearReducer from './Creators/createClearReducer';
import createSetReducer from './Creators/createSetReducer';
import createUpdateReducer from './Creators/createUpdateReducer';
import createUpdateItemReducer from './Creators/createUpdateItemReducer';
import createUpdateServerSideCollectionReducer from './Creators/createUpdateServerSideCollectionReducer';

export const defaultState = {
  isFetching: false,
  isPopulated: false,
  error: null,
  pageSize: 20,
  sortKey: 'date',
  sortDirection: sortDirections.DESCENDING,
  filterKey: null,
  filterValue: null,
  items: []
};

export const persistState = [
  'history.sortKey',
  'history.sortDirection',
  'history.filterKey',
  'history.filterValue'
];

const serverSideCollectionName = 'history';

const historyReducers = handleActions({

  [types.SET]: createSetReducer(serverSideCollectionName),
  [types.UPDATE]: createUpdateReducer(serverSideCollectionName),
  [types.UPDATE_ITEM]: createUpdateItemReducer(serverSideCollectionName),
  [types.UPDATE_SERVER_SIDE_COLLECTION]: createUpdateServerSideCollectionReducer(serverSideCollectionName),

  [types.CLEAR_HISTORY]: createClearReducer('history', {
    isFetching: false,
    isPopulated: false,
    error: null,
    items: []
  })

}, defaultState);

export default historyReducers;
