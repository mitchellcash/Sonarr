import _ from 'lodash';
import $ from 'jquery';
import getMonitoringOptions from 'Utilities/Series/getMonitoringOptions';
import * as types from './actionTypes';
import { set, update, updateItem } from './baseActions';

const section = 'addSeries';

function getNewSeries(series, payload) {
  const {
    rootFolder,
    monitor,
    qualityProfileId,
    seriesType,
    seasonFolder,
    searchForMissingEpisodes
  } = payload;

  const {
    seasons,
    monitoringOptions: addOptions
  } = getMonitoringOptions(series.seasons, monitor);

  addOptions.searchForMissingEpisodes = searchForMissingEpisodes;
  series.addOptions = addOptions;
  series.seasons = seasons;
  series.monitored = true;
  series.qualityProfileId = qualityProfileId;
  series.rootFolderPath = rootFolder;
  series.seriesType = seriesType;
  series.seasonFolder = seasonFolder;

  return series;
}

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
