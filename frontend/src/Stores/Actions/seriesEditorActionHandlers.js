import $ from 'jquery';
import * as types from './actionTypes';
import { set, updateItem } from './baseActions';

const section = 'seriesEditor';

const seriesEditorActionHandlers = {
  [types.SAVE_SERIES_EDITOR]: function(payload) {
    return function(dispatch, getState) {
      dispatch(set({
        section,
        isSaving: true
      }));

      const promise = $.ajax({
        url: '/series/editor',
        method: 'PUT',
        data: JSON.stringify(payload),
        dataType: 'json'
      });

      promise.done((data) => {
        dispatch(set({
          section,
          isSaving: false,
          saveError: null
        }));

        data.forEach((series) => {
          dispatch(updateItem({
            id: series.id,
            section: 'series',
            ...series
          }));
        });
      });

      promise.fail((xhr) => {
        dispatch(set({
          section,
          isSaving: false,
          saveError: xhr
        }));
      });
    };
  }
};

export default seriesEditorActionHandlers;
