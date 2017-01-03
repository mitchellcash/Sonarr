import _ from 'lodash';
import $ from 'jquery';
import getNewSeries from 'Utilities/Series/getNewSeries';
import * as types from './actionTypes';
import { set, update, updateItem } from './baseActions';

const section = 'addSeries';

const addSeriesActionHandlers = {
  [types.LOOKUP_SERIES]: function(payload) {
    return function(dispatch, getState) {
      dispatch(set({ section, fetching: true }));

      const promise = $.ajax({
        url: '/series/lookup',
        data: {
          term: payload.term
        }
      });

      promise.done((data) => {
        dispatch(update({ section, data }));

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
  },

  [types.ADD_SERIES]: function(payload) {
    return function(dispatch, getState) {
      dispatch(set({ section, adding: true }));

      const tvdbId = payload.tvdbId;
      const items = getState().addSeries.items;
      const newSeries = getNewSeries(_.cloneDeep(_.find(items, { tvdbId })), payload);

      const promise = $.ajax({
        url: '/series',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newSeries)
      });

      promise.done((data) => {
        dispatch(updateItem({ section: 'series', ...data }));

        dispatch(set({
          section,
          adding: false,
          added: true,
          addError: null
        }));
      });

      promise.fail((xhr) => {
        dispatch(set({
          section,
          adding: false,
          added: false,
          addError: xhr
        }));
      });
    };
  }
};

export default addSeriesActionHandlers;
