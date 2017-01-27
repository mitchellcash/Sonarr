import React, { Component, PropTypes } from 'react';
import { icons } from 'Helpers/Props';
import IconButton from 'Components/Link/IconButton';
import RelativeDateCellConnector from 'Components/Table/Cells/RelativeDateCellConnector';
import TableRow from 'Components/Table/TableRow';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import episodeEntities from 'Episode/episodeEntities';
import SeasonEpisodeNumber from 'Episode/SeasonEpisodeNumber';
import EpisodeTitleLink from 'Episode/EpisodeTitleLink';
import EpisodeQuality from 'Episode/EpisodeQuality';
import SeriesTitleLink from 'Series/SeriesTitleLink';
import HistoryEventTypeCell from './HistoryEventTypeCell';
import HistoryDetailsModal from './Details/HistoryDetailsModal';
import styles from './HistoryRow.css';

class HistoryRow extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isDetailsModalOpen: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isMarkingAsFailed &&
        this.props.isMarkingAsFailed &&
        !nextProps.markAsFailedError
    ) {
      this.setState({ isDetailsModalOpen: false });
    }
  }

  //
  // Listeners

  onDetailsPress = () => {
    this.setState({ isDetailsModalOpen: true });
  }

  onDetailsModalClose = () => {
    this.setState({ isDetailsModalOpen: false });
  }

  //
  // Render

  render() {
    const {
      episodeId,
      series,
      episode,
      quality,
      eventType,
      sourceTitle,
      date,
      data,
      isMarkingAsFailed,
      shortDateFormat,
      timeFormat,
      onMarkAsFailedPress
    } = this.props;

    if (!episode) {
      return null;
    }

    return (
      <TableRow>
        <HistoryEventTypeCell
          eventType={eventType}
          data={data}
        />

        <TableRowCell>
          <SeriesTitleLink
            titleSlug={series.titleSlug}
            title={series.title}
          />
        </TableRowCell>

        <TableRowCell>
          <SeasonEpisodeNumber
            seasonNumber={episode.seasonNumber}
            episodeNumber={episode.episodeNumber}
            absoluteEpisodeNumber={episode.absoluteEpisodeNumber}
            seriesType={series.seriesType}
            sceneSeasonNumber={episode.sceneSeasonNumber}
            sceneEpisodeNumber={episode.sceneEpisodeNumber}
            sceneAbsoluteEpisodeNumber={episode.sceneAbsoluteEpisodeNumber}
          />
        </TableRowCell>

        <TableRowCell>
          <EpisodeTitleLink
            episodeId={episodeId}
            episodeEntity={episodeEntities.EPISODES}
            seriesId={series.id}
            episodeTitle={episode.title}
            showOpenSeriesButton={true}
          />
        </TableRowCell>

        <TableRowCell>
          <EpisodeQuality
            quality={quality}
          />
        </TableRowCell>

        <RelativeDateCellConnector
          date={date}
        />

        <TableRowCell className={styles.details}>
          <IconButton
            name={icons.INFO}
            onPress={this.onDetailsPress}
          />
        </TableRowCell>

        <HistoryDetailsModal
          isOpen={this.state.isDetailsModalOpen}
          eventType={eventType}
          sourceTitle={sourceTitle}
          data={data}
          isMarkingAsFailed={isMarkingAsFailed}
          shortDateFormat={shortDateFormat}
          timeFormat={timeFormat}
          onMarkAsFailedPress={onMarkAsFailedPress}
          onModalClose={this.onDetailsModalClose}
        />
      </TableRow>
    );
  }

}

HistoryRow.propTypes = {
  episodeId: PropTypes.number,
  series: PropTypes.object.isRequired,
  episode: PropTypes.object,
  quality: PropTypes.object.isRequired,
  eventType: PropTypes.string.isRequired,
  sourceTitle: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  isMarkingAsFailed: PropTypes.bool,
  shortDateFormat: PropTypes.string.isRequired,
  timeFormat: PropTypes.string.isRequired,
  onMarkAsFailedPress: PropTypes.func.isRequired
};

export default HistoryRow;
