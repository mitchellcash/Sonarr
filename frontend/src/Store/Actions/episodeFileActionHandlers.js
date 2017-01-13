import $ from 'jquery';
import createFetchHandler from './Creators/createFetchHandler';
import createRemoveItemHandler from './Creators/createRemoveItemHandler';
import * as types from './actionTypes';
import { set, removeItem, updateItem } from './baseActions';

const section = 'episodeFiles';

const episodeFileActionHandlers = {
  [types.FETCH_EPISODE_FILES]: createFetchHandler(section, '/episodeFile'),
  [types.DELETE_EPISODE_FILE]: createRemoveItemHandler(section, '/episodeFile'),

  [types.DELETE_EPISODE_FILES]: function(payload) {
    return function(dispatch, getState) {
      const {
        episodeFileIds
      } = payload;

      dispatch(set({ section, deleting: true }));

      const promise = $.ajax({
        url: '/episodeFile/bulk',
        method: 'DELETE',
        dataType: 'json',
        data: JSON.stringify({ episodeFileIds })
      });

      promise.done(() => {
        episodeFileIds.forEach((id) => {
          dispatch(removeItem({ section, id }));
        });

        dispatch(set({
          section,
          deleting: false,
          deleteError: null
        }));
      });

      promise.fail((xhr) => {
        dispatch(set({
          section,
          deleting: false,
          deleteError: xhr
        }));
      });
    };
  },

  [types.UPDATE_EPISODE_FILES]: function(payload) {
    return function(dispatch, getState) {
      const {
        episodeFileIds,
        quality
      } = payload;

      dispatch(set({ section, saving: true }));

      const promise = $.ajax({
        url: '/episodeFile/editor',
        method: 'PUT',
        dataType: 'json',
        data: JSON.stringify({ episodeFileIds, quality })
      });

      promise.done(() => {
        episodeFileIds.forEach((id) => {
          dispatch(updateItem({ section, id, quality }));
        });

        dispatch(set({
          section,
          saving: false,
          saveError: null
        }));
      });

      promise.fail((xhr) => {
        dispatch(set({
          section,
          saving: false,
          saveError: xhr
        }));
      });
    };
  }
};

export default episodeFileActionHandlers;
