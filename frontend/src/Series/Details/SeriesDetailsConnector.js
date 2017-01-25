import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { findCommand } from 'Utilities/Command';
import createAllSeriesSelector from 'Store/Selectors/createAllSeriesSelector';
import createCommandsSelector from 'Store/Selectors/createCommandsSelector';
import { fetchEpisodes, clearEpisodes } from 'Store/Actions/episodeActions';
import { fetchEpisodeFiles, clearEpisodeFiles } from 'Store/Actions/episodeFileActions';
import { fetchQueueDetails, clearQueueDetails } from 'Store/Actions/queueActions';
import { executeCommand } from 'Store/Actions/commandActions';
import * as commandNames from 'Commands/commandNames';
import SeriesDetails from './SeriesDetails';

function createMapStateToProps() {
  return createSelector(
    (state, { params }) => params,
    (state) => state.episodes,
    (state) => state.episodeFiles,
    createAllSeriesSelector(),
    createCommandsSelector(),
    (params, episodes, episodeFiles, allSeries, commands) => {
      const sortedSeries = _.orderBy(allSeries, 'sortTitle');
      const seriesIndex = _.findIndex(sortedSeries, { titleSlug: params.titleSlug });
      const series = sortedSeries[seriesIndex];
      const previousSeries = sortedSeries[seriesIndex - 1] || _.last(sortedSeries);
      const nextSeries = sortedSeries[seriesIndex + 1] || _.first(sortedSeries);
      const isRefreshing = !!findCommand(commands, { name: commandNames.REFRESH_SERIES, seriesId: series.id });
      const isSearching = !!findCommand(commands, { name: commandNames.SERIES_SEARCH, seriesId: series.id });

      const isFetching = episodes.fetching || episodeFiles.fetching;
      const isPopulated = episodes.populated && episodeFiles.populated;
      const episodesError = episodes.error;
      const episodeFilesError = episodeFiles.error;
      const alternateTitles = _.reduce(series.alternateTitles, (acc, alternateTitle) => {
        if ((alternateTitle.seasonNumber === -1 || alternateTitle.seasonNumber === undefined) &&
            (alternateTitle.sceneSeasonNumber === -1 || alternateTitle.sceneSeasonNumber === undefined)) {
          acc.push(alternateTitle.title);
        }

        return acc;
      }, []);

      return {
        ...series,
        alternateTitles,
        isRefreshing,
        isSearching,
        isFetching,
        isPopulated,
        episodesError,
        episodeFilesError,
        previousSeries,
        nextSeries
      };
    }
  );
}

const mapDispatchToProps = {
  fetchEpisodes,
  clearEpisodes,
  fetchEpisodeFiles,
  clearEpisodeFiles,
  fetchQueueDetails,
  clearQueueDetails,
  executeCommand
};

class SeriesDetailsConnector extends Component {

  //
  // Lifecycle

  componentDidMount() {
    this._populate(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this._populate(nextProps);
    }
  }

  componentWillUnmount() {
    this.props.clearEpisodes();
    this.props.clearEpisodeFiles();
    this.props.clearQueueDetails();
  }

  //
  // Control

  _populate(props) {
    const seriesId = props.id;

    this.props.fetchEpisodes({ seriesId });
    this.props.fetchEpisodeFiles({ seriesId });
    this.props.fetchQueueDetails({ seriesId });
  }

  //
  // Listeners

  onRefreshPress = () => {
    this.props.executeCommand({
      name: commandNames.REFRESH_SERIES,
      seriesId: this.props.id
    });
  }

  onSearchPress = () => {
    this.props.executeCommand({
      name: commandNames.SERIES_SEARCH,
      seriesId: this.props.id
    });
  }

  onDeletePress = () => {

  }

  //
  // Render

  render() {
    return (
      <SeriesDetails
        {...this.props}
        onRefreshPress={this.onRefreshPress}
        onSearchPress={this.onSearchPress}
        onDeletePress={this.onDeletePress}
      />
    );
  }
}

SeriesDetailsConnector.propTypes = {
  id: PropTypes.number.isRequired,
  params: PropTypes.shape({ titleSlug: PropTypes.string.isRequired }).isRequired,
  fetchEpisodes: PropTypes.func.isRequired,
  clearEpisodes: PropTypes.func.isRequired,
  fetchEpisodeFiles: PropTypes.func.isRequired,
  clearEpisodeFiles: PropTypes.func.isRequired,
  fetchQueueDetails: PropTypes.func.isRequired,
  clearQueueDetails: PropTypes.func.isRequired,
  executeCommand: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(SeriesDetailsConnector);
