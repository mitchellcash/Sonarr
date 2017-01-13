import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import formatBytes from 'Utilities/Number/formatBytes';
import { align, icons, sizes } from 'Helpers/Props';
import HeartRating from 'Components/HeartRating';
import Icon from 'Components/Icon';
import IconButton from 'Components/IconButton';
import Label from 'Components/Label';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import PageToolbarSeparator from 'Components/Page/Toolbar/PageToolbarSeparator';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import QualityProfileNameConnector from 'Settings/Profiles/Quality/QualityProfileNameConnector';
import OrganizePreviewModalConnector from 'Organize/OrganizePreviewModalConnector';
import SeriesPoster from 'Series/SeriesPoster';
import EditSeriesModalConnector from 'Series/Edit/EditSeriesModalConnector';
import DeleteSeriesModal from 'Series/Delete/DeleteSeriesModal';
import styles from './SeriesDetails.css';

function getFanartUrl(images) {
  const fanartImage = _.find(images, { coverType: 'fanart' });
  if (fanartImage) {
    // Remove protocol
    return fanartImage.url.replace(/^https?:/, '');
  }
}

class SeriesDetails extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isOrganizeModalOpen: false,
      isEditSeriesModalOpen: false,
      isDeleteSeriesModalOpen: false
    };
  }

  //
  // Listeners

  onOrganizePress = () => {
    this.setState({ isOrganizeModalOpen: true });
  }

  onOrganizeModalClose = () => {
    this.setState({ isOrganizeModalOpen: false });
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
      id,
      title,
      runtime,
      ratings,
      sizeOnDisk,
      episodeFilesCount,
      qualityProfileId,
      overview,
      images,
      isRefreshing,
      isSearching,
      previousSeries,
      nextSeries,
      onRefreshPress,
      onSearchPress
    } = this.props;

    const {
      isOrganizeModalOpen,
      isEditSeriesModalOpen,
      isDeleteSeriesModalOpen
    } = this.state;

    let episodeFilesCountMessage = 'No episode files';

    if (episodeFilesCount === 1) {
      episodeFilesCountMessage = '1 episode file';
    } else if (episodeFilesCount > 1) {
      episodeFilesCountMessage = `${episodeFilesCount} episode files`;
    }

    return (
      <PageContent>
        <PageToolbar>
          <PageToolbarSection>
            <PageToolbarButton
              iconName={icons.REFRESH}
              title="Search for monitored episodes in this series"
              animate={isRefreshing}
              onPress={onRefreshPress}
            />

            <PageToolbarButton
              iconName={icons.SEARCH}
              title="Search for monitored episodes in this series"
              animate={isSearching}
              onPress={onSearchPress}
            />

            <PageToolbarSeparator />

            <PageToolbarButton
              iconName={icons.ORGANIZE}
              title="Preview rename for this series"
              onPress={this.onOrganizePress}
            />

            <PageToolbarButton
              iconName={icons.EPISODE_FILE}
              title="Manage episode files in this series"
              // onPress={onSearchPress}
            />

            <PageToolbarSeparator />

            <PageToolbarButton
              iconName={icons.EDIT}
              title="Edit series"
              onPress={this.onEditSeriesPress}
            />

            <PageToolbarButton
              iconName={icons.DELETE}
              title="Delete series"
              onPress={this.onDeleteSeriesPress}
            />

            <PageToolbarSeparator />
          </PageToolbarSection>

          <PageToolbarSection align={align.RIGHT}>
            <PageToolbarButton
              iconName={icons.EXPAND}
              title="Expand all seasons in this series"
              // onPress={onSearchPress}
            />
          </PageToolbarSection>
        </PageToolbar>

        <PageContentBody innerClassName={styles.innerContentBody}>
          <div className={styles.header}>
            <div
              className={styles.backdrop}
              style={{
                backgroundImage: `url(${getFanartUrl(images)})`
              }}
            >
              <div className={styles.backdropOverlay} />
            </div>

            <div className={styles.headerContent}>
              <SeriesPoster
                className={styles.poster}
                images={images}
                size={500}
                lazy={false}
              />

              <div className={styles.info}>
                <div className={styles.titleContainer}>
                  <div className={styles.title}>
                  {title}
                  </div>

                  <div>
                    <IconButton
                      className={styles.seriesNavigationButton}
                      name={icons.ARROW_LEFT}
                      size={30}
                      title={`Go to ${previousSeries.title}`}
                      to={`/series/${previousSeries.titleSlug}`}
                    />

                    <IconButton
                      className={styles.seriesNavigationButton}
                      name={icons.ARROW_RIGHT}
                      size={30}
                      title={`Go to ${nextSeries.title}`}
                      to={`/series/${nextSeries.titleSlug}`}
                    />
                  </div>
                </div>

                <div className={styles.details}>
                  <div>
                    {
                      !!runtime &&
                        <span className={styles.runtime}>
                          {runtime} Minutes
                        </span>
                    }

                    <HeartRating
                      rating={ratings.value}
                      iconSize={20}
                    />
                  </div>
                </div>

                <div className={styles.detailsLabels}>
                  <Label
                    className={styles.detailsLabel}
                    title={episodeFilesCountMessage}
                    size={sizes.LARGE}
                  >
                    <Icon
                      name={icons.DRIVE}
                      size={17}
                    />

                    <span className={styles.sizeOnDisk}>
                      {
                        formatBytes(sizeOnDisk)
                      }
                    </span>
                  </Label>

                  <Label
                    className={styles.detailsLabel}
                    title={episodeFilesCountMessage}
                    size={sizes.LARGE}
                  >
                    <Icon
                      name={icons.PROFILE}
                      size={17}
                    />

                    <span className={styles.qualityProfileName}>
                      {
                        <QualityProfileNameConnector
                          qualityProfileId={qualityProfileId}
                        />
                      }
                    </span>
                  </Label>
                </div>

                <div>
                  {overview}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.contentContainer}>
            Content goes here

          </div>

          <OrganizePreviewModalConnector
            isOpen={isOrganizeModalOpen}
            seriesId={id}
            onModalClose={this.onOrganizeModalClose}
          />

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
        </PageContentBody>
      </PageContent>
    );
  }
}

SeriesDetails.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  runtime: PropTypes.number.isRequired,
  ratings: PropTypes.object.isRequired,
  sizeOnDisk: PropTypes.number.isRequired,
  episodeFilesCount: PropTypes.number,
  qualityProfileId: PropTypes.number.isRequired,
  overview: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  isSearching: PropTypes.bool.isRequired,
  previousSeries: PropTypes.object.isRequired,
  nextSeries: PropTypes.object.isRequired,
  onRefreshPress: PropTypes.func.isRequired,
  onSearchPress: PropTypes.func.isRequired
};

export default SeriesDetails;
