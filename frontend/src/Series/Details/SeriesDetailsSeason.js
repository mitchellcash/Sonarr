import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import isAfter from 'Utilities/Date/isAfter';
import { icons } from 'Helpers/Props';
import IconButton from 'Components/IconButton';
import MonitorToggleButton from 'Components/MonitorToggleButton';
import SpinnerIconButton from 'Components/SpinnerIconButton';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import EpisodeFileEditorModal from 'EpisodeFile/Editor/EpisodeFileEditorModal';
import OrganizePreviewModalConnector from 'Organize/OrganizePreviewModalConnector';
import EpisodeRowConnector from './EpisodeRowConnector';
import styles from './SeriesDetailsSeason.css';

const headers = [
  {
    name: 'monitored'
  },
  {
    name: 'episodeNumber',
    label: '#'
  },
  {
    name: 'title',
    label: 'Title'
  },
  {
    name: 'airDateUtc',
    label: 'Air Date'
  },
  {
    name: 'status',
    label: 'Status'
  },
  {
    name: 'actions'
  }
];

class SeriesDetailsSeason extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isOrganizeModalOpen: false,
      isManageEpisodesOpen: false
    };
  }

  componentWillMount() {
    const {
      seasonNumber,
      onExpandPress,
      items
    } = this.props;

    const expand = _.some(items, (item) => {
      return isAfter(item.airDateUtc) ||
             isAfter(item.airDateUtc, { days: -30 });
    });

    onExpandPress(seasonNumber, expand);
  }

  //
  // Listeners

  onOrganizePress = () => {
    this.setState({ isOrganizeModalOpen: true });
  }

  onOrganizeModalClose = () => {
    this.setState({ isOrganizeModalOpen: false });
  }

  onManageEpisodesPress = () => {
    this.setState({ isManageEpisodesOpen: true });
  }

  onManageEpisodesModalClose = () => {
    this.setState({ isManageEpisodesOpen: false });
  }

  onExpandPress = () => {
    const {
      seasonNumber,
      isExpanded
    } = this.props;

    this.props.onExpandPress(seasonNumber, !isExpanded);
  }

  //
  // Render

  render() {
    const {
      seriesId,
      monitored,
      seasonNumber,
      items,
      isSaving,
      isExpanded,
      isSearching,
      seriesMonitored,
      onMonitorSeasonPress,
      onSearchPress
    } = this.props;

    const {
      isOrganizeModalOpen,
      isManageEpisodesOpen
    } = this.state;

    return (
      <div
        className={styles.season}
      >
        <div className={styles.header}>
          <div className={styles.left}>
            <MonitorToggleButton
              monitored={monitored}
              isDisabled={!seriesMonitored}
              isSaving={isSaving}
              size={24}
              onPress={onMonitorSeasonPress}
            />

            {
              seasonNumber === 0 ?
                <span className={styles.seasonNumber}>
                  Specials
                </span> :
                <span className={styles.seasonNumber}>
                  Season {seasonNumber}
                </span>
            }
          </div>

          <div
            className={styles.expandButton}
            onDoubleClick={this.onExpandPress}
          >

          </div>

          <div className={styles.actions}>
            <SpinnerIconButton
              className={styles.actionButton}
              name={icons.SEARCH}
              title="Search for monitored episodes in this seasons"
              size={24}
              isSpinning={isSearching}
              onPress={onSearchPress}
            />

            <IconButton
              className={styles.actionButton}
              name={icons.ORGANIZE}
              title="Preview rename for this season"
              size={24}
              onPress={this.onOrganizePress}
            />

            <IconButton
              className={styles.actionButton}
              name={icons.EPISODE_FILE}
              title="Manage episode files in this series"
              size={24}
              onPress={this.onManageEpisodesPress}
            />

            <IconButton
              className={styles.actionButton}
              name={isExpanded ? icons.COLLAPSE : icons.EXPAND}
              title="Show episodes"
              size={24}
              onPress={this.onExpandPress}
            />
          </div>
        </div>

        <div>
          {
            isExpanded &&
              <div className={styles.episodes}>
                {
                  !!items.length &&
                    <Table
                      headers={headers}
                    >
                      <TableBody>
                        {
                          items.slice().reverse().map((item) => {
                            return (
                              <EpisodeRowConnector
                                key={item.id}
                                {...item}
                              />
                            );
                          })
                        }
                      </TableBody>
                    </Table>
                }
                <div className={styles.collapseButtonContainer}>
                  <IconButton
                    name={icons.COLLAPSE}
                    size={20}
                    title="Hide episodes"
                    onPress={this.onExpandPress}
                  />
                </div>
              </div>
          }
        </div>

        <OrganizePreviewModalConnector
          isOpen={isOrganizeModalOpen}
          seriesId={seriesId}
          seasonNumber={seasonNumber}
          onModalClose={this.onOrganizeModalClose}
        />

        <EpisodeFileEditorModal
          isOpen={isManageEpisodesOpen}
          seriesId={seriesId}
          seasonNumber={seasonNumber}
          onModalClose={this.onManageEpisodesModalClose}
        />
      </div>
    );
  }
}

SeriesDetailsSeason.propTypes = {
  seriesId: PropTypes.number.isRequired,
  monitored: PropTypes.bool.isRequired,
  seasonNumber: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  isSaving: PropTypes.bool,
  isExpanded: PropTypes.bool,
  isSearching: PropTypes.bool.isRequired,
  seriesMonitored: PropTypes.bool.isRequired,
  onMonitorSeasonPress: PropTypes.func.isRequired,
  onExpandPress: PropTypes.func.isRequired,
  onSearchPress: PropTypes.func.isRequired
};

export default SeriesDetailsSeason;
