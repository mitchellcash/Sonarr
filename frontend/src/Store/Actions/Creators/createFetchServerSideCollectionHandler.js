import _ from 'lodash';
import $ from 'jquery';
import { set, updateServerSideCollection } from '../baseActions';

function createFetchServerSideCollectionHandler(section, url, getFromState) {
  return function(payload) {
    return function(dispatch, getState) {
      dispatch(set({ section, fetching: true }));

      const state = getFromState(getState());
      const sectionState = state.hasOwnProperty(section) ? state[section] : state;

      const data = Object.assign({ page: 1 },
        _.pick(sectionState, [
          'page',
          'pageSize',
          'sortDirection',
          'sortKey',
          'filterKey',
          'filterValue'
        ]));

      const promise = $.ajax({
        url,
        data
      });

      promise.done((response) => {
        dispatch(updateServerSideCollection({ section, data: response }));

        dispatch(set({
          section,
          fetching: false,
          populated: true,
          error: null
        }));
      });

      promise.fail((xhr) => {
        dispatch(set({
          section,
          fetching: false,
          populated: false,
          error: xhr
        }));
      });
    };
  };
}

export default createFetchServerSideCollectionHandler;
