import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createAllSeriesSelector from 'Store/Selectors/createAllSeriesSelector';
import createCommandsSelector from 'Store/Selectors/createCommandsSelector';
import { fetchEpisodes } from 'Store/Actions/episodeActions';
import { fetchEpisodeFiles } from 'Store/Actions/episodeFileActions';
import { executeCommand } from 'Store/Actions/commandActions';
import commandNames from 'Commands/commandNames';
import SeriesDetails from './SeriesDetails';

function createMapStateToProps() {
  return createSelector(
    (state, { params }) => params,
    createAllSeriesSelector(),
    createCommandsSelector(),
    (params, allSeries, commands) => {
      const sortedSeries = _.orderBy(allSeries, 'sortTitle');
      const seriesIndex = _.findIndex(sortedSeries, { titleSlug: params.titleSlug });
      const series = sortedSeries[seriesIndex];
      const previousSeries = sortedSeries[seriesIndex - 1] || _.last(sortedSeries);
      const nextSeries = sortedSeries[seriesIndex + 1] || _.first(sortedSeries);
      const isRefreshing = _.some(commands, { name: commandNames.REFRESH_SERIES, seriesId: series.id });
      const isSearching = _.some(commands, { name: commandNames.SERIES_SEARCH, seriesId: series.id });

      return {
        ...series,
        isRefreshing,
        isSearching,
        previousSeries,
        nextSeries
      };
    }
  );
}

const mapDispatchToProps = {
  fetchEpisodes,
  fetchEpisodeFiles,
  executeCommand
};

class SeriesDetailsConnector extends Component {

  //
  // Lifecycle

  componentDidMount() {
    const seriesId = this.props.id;

    this.props.fetchEpisodes({ seriesId });
    this.props.fetchEpisodeFiles({ seriesId });
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
      name: commandNames.SEARCH_SERIES,
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
  fetchEpisodeFiles: PropTypes.func.isRequired,
  executeCommand: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(SeriesDetailsConnector);
