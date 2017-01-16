import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createSeriesSelector from 'Store/Selectors/createSeriesSelector';
import createCommandsSelector from 'Store/Selectors/createCommandsSelector';
import { toggleEpisodeMonitored } from 'Store/Actions/episodeActions';
import { executeCommand } from 'Store/Actions/commandActions';
import * as commandNames from 'Commands/commandNames';
import EpisodeRow from './EpisodeRow';

function createMapStateToProps() {
  return createSelector(
    (state, { id }) => id,
    (state, { sceneSeasonNumber }) => sceneSeasonNumber,
    createSeriesSelector(),
    createCommandsSelector(),
    (id, sceneSeasonNumber, series, commands) => {
      const isSearching = _.some(commands, (command) => {
        const episodeSearch = command.name === command.EPISODE_SEARCH;

        if (!episodeSearch) {
          return false;
        }

        return command.episodeIds.indexOf(id) > -1;
      });

      const alternateTitles = sceneSeasonNumber ? _.filter(series.alternateTitles, { sceneSeasonNumber }) : [];

      return {
        seriesMonitored: series.monitored,
        seriesType: series.seriesType,
        alternateTitles,
        isSearching
      };
    }
  );
}

const mapDispatchToProps = {
  toggleEpisodeMonitored,
  executeCommand
};

class EpisodeRowConnector extends Component {

  //
  // Listeners

  onSearchPress = () => {
    this.props.executeCommand({
      name: commandNames.EPISODE_SEARCH,
      episodeIds: [this.props.id]
    });
  }

  //
  // Render

  render() {
    return (
      <EpisodeRow
        {...this.props}
        onSearchPress={this.onSearchPress}
      />
    );
  }
}

EpisodeRowConnector.propTypes = {
  id: PropTypes.number.isRequired,
  seriesId: PropTypes.number.isRequired,
  sceneSeasonNumber: PropTypes.number,
  onMonitorEpisodePress: PropTypes.func.isRequired,
  toggleEpisodeMonitored: PropTypes.func.isRequired,
  executeCommand: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(EpisodeRowConnector);
