import React, { Component, PropTypes } from 'react';
import { icons } from 'Helpers/Props';
import MonitorToggleButton from 'Components/MonitorToggleButton';
import IconButton from 'Components/IconButton';
import RelativeDateCellConnector from 'Components/Table/Cells/RelativeDateCellConnector';
import TableRow from 'Components/Table/TableRow';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import EpisodeDetailsModal from 'Episode/EpisodeDetailsModal';
import EpisodeNumber from 'Episode/EpisodeNumber';
import EpisodeTitleLink from 'Episode/EpisodeTitleLink';
import EpisodeStatusConnector from 'Episode/EpisodeStatusConnector';
import styles from './EpisodeRow.css';

class EpisodeRow extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isDetailsModalOpen: false
    };
  }

  //
  // Listeners

  onManualSearchPress = () => {
    this.setState({ isDetailsModalOpen: true });
  }

  onDetailsModalClose = () => {
    this.setState({ isDetailsModalOpen: false });
  }

  //
  // Render

  render() {
    const {
      id,
      seriesId,
      episodeFileId,
      monitored,
      seasonNumber,
      episodeNumber,
      absoluteEpisodeNumber,
      sceneSeasonNumber,
      sceneEpisodeNumber,
      sceneAbsoluteEpisodeNumber,
      airDateUtc,
      title,
      unverifiedSceneNumbering,
      isSaving,
      seriesMonitored,
      seriesType,
      alternateTitles,
      onMonitorEpisodePress,
      onSearchPress
    } = this.props;

    return (
      <TableRow>
        <TableRowCell className={styles.monitored}>
          <MonitorToggleButton
            monitored={monitored}
            isDisabled={!seriesMonitored}
            isSaving={isSaving}
            onPress={onMonitorEpisodePress}
          />
        </TableRowCell>

        <TableRowCell className={styles.episodeNumber}>
          <EpisodeNumber
            seasonNumber={seasonNumber}
            episodeNumber={episodeNumber}
            absoluteEpisodeNumber={absoluteEpisodeNumber}
            unverifiedSceneNumbering={unverifiedSceneNumbering}
            seriesType={seriesType}
            sceneSeasonNumber={sceneSeasonNumber}
            sceneEpisodeNumber={sceneEpisodeNumber}
            sceneAbsoluteEpisodeNumber={sceneAbsoluteEpisodeNumber}
            alternateTitles={alternateTitles}
          />
        </TableRowCell>

        <TableRowCell>
          <EpisodeTitleLink
            episodeId={id}
            seriesId={seriesId}
            episodeTitle={title}
            showOpenSeriesButton={true}
          />
        </TableRowCell>

        <RelativeDateCellConnector
          date={airDateUtc}
        />

        <TableRowCell className={styles.status}>
          <EpisodeStatusConnector
            episodeId={id}
            episodeFileId={episodeFileId}
          />
        </TableRowCell>

        <TableRowCell className={styles.actions}>
          <IconButton
            name={icons.SEARCH}
            onPress={onSearchPress}
          />

          <IconButton
            name={icons.INTERACTIVE}
            onPress={this.onManualSearchPress}
          />
        </TableRowCell>

        <EpisodeDetailsModal
          isOpen={this.state.isDetailsModalOpen}
          episodeId={id}
          seriesId={seriesId}
          episodeTitle={title}
          selectedTab="search"
          startInteractiveSearch={true}
          onModalClose={this.onDetailsModalClose}
        />
      </TableRow>
    );
  }
}

EpisodeRow.propTypes = {
  id: PropTypes.number.isRequired,
  seriesId: PropTypes.number.isRequired,
  episodeFileId: PropTypes.number,
  monitored: PropTypes.bool.isRequired,
  seasonNumber: PropTypes.number.isRequired,
  episodeNumber: PropTypes.number.isRequired,
  absoluteEpisodeNumber: PropTypes.number,
  sceneSeasonNumber: PropTypes.number,
  sceneEpisodeNumber: PropTypes.number,
  sceneAbsoluteEpisodeNumber: PropTypes.number,
  airDateUtc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isSaving: PropTypes.bool,
  unverifiedSceneNumbering: PropTypes.bool,
  seriesMonitored: PropTypes.bool.isRequired,
  seriesType: PropTypes.string.isRequired,
  alternateTitles: PropTypes.arrayOf(PropTypes.object).isRequired,
  onMonitorEpisodePress: PropTypes.func.isRequired,
  onSearchPress: PropTypes.func.isRequired
};

export default EpisodeRow;
