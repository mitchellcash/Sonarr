import React, { Component, PropTypes } from 'react';
import getProgressBarKind from 'Utilities/Series/getProgressBarKind';
import { icons } from 'Helpers/Props';
import IconButton from 'Components/Link/IconButton';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import ProgressBar from 'Components/ProgressBar';
import VirtualTableRow from 'Components/Table/VirtualTableRow';
import VirtualTableRowCell from 'Components/Table/Cells/VirtualTableRowCell';
import RelativeDateCellConnector from 'Components/Table/Cells/RelativeDateCellConnector';
import SeriesTitleLink from 'Series/SeriesTitleLink';
import EditSeriesModalConnector from 'Series/Edit/EditSeriesModalConnector';
import DeleteSeriesModal from 'Series/Delete/DeleteSeriesModal';
import SeriesStatusCell from './SeriesStatusCell';
import styles from './SeriesIndexRow.css';

class SeriesIndexRow extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isEditSeriesModalOpen: false,
      isDeleteSeriesModalOpen: false
    };
  }

  onEditSeriesPress = () => {
    this.setState({ isEditSeriesModalOpen: true });
  }

  onEditSeriesModalClose = () => {
    this.setState({ isEditSeriesModalOpen: false });
  }

  onDeleteSeriesPress = () => {
    this.setState({
      isEditSeriesModalOpen: false,
      isDeleteSeriesModalOpen: true
    });
  }

  onDeleteSeriesModalClose = () => {
    this.setState({ isDeleteSeriesModalOpen: false });
  }

  //
  // Render

  render() {
    const {
      style,
      id,
      monitored,
      status,
      title,
      titleSlug,
      network,
      qualityProfile,
      nextAiring,
      previousAiring,
      seasonCount,
      episodeCount,
      episodeFileCount,
      isRefreshingSeries,
      onRefreshSeriesPress,
      ...otherProps
    } = this.props;

    const {
      isEditSeriesModalOpen,
      isDeleteSeriesModalOpen
    } = this.state;

    const progress = episodeCount ? episodeFileCount / episodeCount * 100 : 100;

    return (
      <VirtualTableRow style={style}>
        <SeriesStatusCell
          className={styles.status}
          monitored={monitored}
          status={status}
          component={VirtualTableRowCell}
        />

        <VirtualTableRowCell className={styles.title} style={{ flexGrow: 1, flexShrink: 0, flexBasis: '110px' }}>
          <SeriesTitleLink
            titleSlug={titleSlug}
            title={title}
          />
        </VirtualTableRowCell>

        <VirtualTableRowCell className={styles.network}>
          {network}
        </VirtualTableRowCell>

        <VirtualTableRowCell className={styles.qualityProfile}>
          {qualityProfile.name}
        </VirtualTableRowCell>

        <RelativeDateCellConnector
          className={styles.relativeDate}
          date={nextAiring}
          component={VirtualTableRowCell}
        />

        {/* <RelativeDateCellConnector
          date={previousAiring}
          component={VirtualTableRowCell}
        /> */}

        <VirtualTableRowCell className={styles.seasonCount}>
          {seasonCount}
        </VirtualTableRowCell>

        <VirtualTableRowCell className={styles.episodeProgress}>
          <ProgressBar
            progress={progress}
            kind={getProgressBarKind(status, monitored, progress)}
            showText={true}
            text={`${episodeFileCount} / ${episodeCount}`}
            width={125}
          />
        </VirtualTableRowCell>

        <VirtualTableRowCell className={styles.actions}>
          <SpinnerIconButton
            name={icons.REFRESH}
            title="Refresh series"
            isSpinning={isRefreshingSeries}
            onPress={onRefreshSeriesPress}
          />

          <IconButton
            name={icons.EDIT}
            title="Edit Series"
            onPress={this.onEditSeriesPress}
          />
        </VirtualTableRowCell>

        <EditSeriesModalConnector
          isOpen={isEditSeriesModalOpen}
          seriesId={id}
          onModalClose={this.onEditSeriesModalClose}
          onDeleteSeriesPress={this.onDeleteSeriesPress}
        />

        <DeleteSeriesModal
          isOpen={isDeleteSeriesModalOpen}
          seriesId={id}
          onModalClose={this.onDeleteSeriesModalClose}
        />
      </VirtualTableRow>
    );
  }
}

SeriesIndexRow.propTypes = {
  style: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  monitored: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  titleSlug: PropTypes.string.isRequired,
  network: PropTypes.string.isRequired,
  qualityProfile: PropTypes.object.isRequired,
  nextAiring: PropTypes.string,
  previousAiring: PropTypes.string,
  seasonCount: PropTypes.number.isRequired,
  episodeCount: PropTypes.number,
  episodeFileCount: PropTypes.number,
  isRefreshingSeries: PropTypes.bool.isRequired,
  onRefreshSeriesPress: PropTypes.func.isRequired
};

SeriesIndexRow.defaultProps = {
  episodeCount: 0,
  episodeFileCount: 0
};

export default SeriesIndexRow;
