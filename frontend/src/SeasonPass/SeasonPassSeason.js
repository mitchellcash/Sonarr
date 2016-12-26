import React, { Component, PropTypes } from 'react';
import classNames from 'classNames';
import padNumber from 'Utilities/Number/padNumber';
import Label from 'Components/Label';
import MonitorToggleButton from 'Components/MonitorToggleButton';
import styles from './SeasonPassSeason.css';

class SeasonPassSeason extends Component {

  //
  // Listeners

  onSeasonMonitoredPress = () => {
    const {
      seasonNumber,
      monitored
    } = this.props;

    this.props.onSeasonMonitoredPress(seasonNumber, !monitored);
  }

  //
  // Render

  render() {
    const {
      seasonNumber,
      monitored,
      statistics,
      isSaving
    } = this.props;

    const {
      episodeFileCount,
      totalEpisodeCount,
      percentOfEpisodes
    } = statistics;

    return (
      <div className={styles.season}>
        <div className={styles.info}>
          <MonitorToggleButton
            monitored={monitored}
            isSaving={isSaving}
            onPress={this.onSeasonMonitoredPress}
          />

          <span className={styles.seasonNumber}>
            {
              seasonNumber === 0 ? 'Specials' : `S${padNumber(seasonNumber, 2)}`
            }
          </span>
        </div>

        <div
          className={classNames(
            styles.episodes,
            percentOfEpisodes === 100 && styles.allEpisodes
          )}
          title={`${episodeFileCount}/${totalEpisodeCount} episodes downloaded`}
        >
          {
            totalEpisodeCount === 0 ? '0/0' : `${episodeFileCount}/${totalEpisodeCount}`
          }
        </div>
      </div>
    );
  }
}

SeasonPassSeason.propTypes = {
  seasonNumber: PropTypes.number.isRequired,
  monitored: PropTypes.bool.isRequired,
  statistics: PropTypes.object.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onSeasonMonitoredPress: PropTypes.func.isRequired
};

SeasonPassSeason.defaultProps = {
  isSaving: false
};

export default SeasonPassSeason;
