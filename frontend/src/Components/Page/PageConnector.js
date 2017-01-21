import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import { initSignalR, saveDimensions } from 'Store/Actions/appActions';
import { fetchSeries } from 'Store/Actions/seriesActions';
import { fetchTags } from 'Store/Actions/tagActions';
import { fetchQualityProfiles, fetchUISettings } from 'Store/Actions/settingsActions';
import { fetchStatus } from 'Store/Actions/systemActions';
import ErrorPage from './ErrorPage';
import LoadingPage from './LoadingPage';
import Page from './Page';

function createMapStateToProps() {
  return createSelector(
    (state) => state.series,
    (state) => state.tags,
    (state) => state.settings,
    createDimensionsSelector(),
    (series, tags, settings, dimensions) => {
      const isPopulated = series.populated &&
        tags.populated &&
        settings.qualityProfiles.populated &&
        settings.ui.populated;

      const hasError = !!series.error ||
        !!tags.error ||
        !!settings.qualityProfiles.error ||
        !!settings.ui.error;

      return {
        isPopulated,
        hasError,
        seriesError: series.error,
        tagsError: tags.error,
        qualityProfilesError: settings.qualityProfiles.error,
        uiSettingsError: settings.ui.error,
        isSmallScreen: dimensions.isSmallScreen
      };
    }
  );
}

const mapDispatchToProps = {
  initSignalR,
  saveDimensions,
  fetchSeries,
  fetchTags,
  fetchQualityProfiles,
  fetchUISettings,
  fetchStatus
};

class PageConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    if (!this.props.isPopulated) {
      this.props.fetchSeries();
      this.props.fetchTags();
      this.props.fetchQualityProfiles();
      this.props.fetchUISettings();
      this.props.fetchStatus();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPopulated && !this.props.isPopulated) {
      this.props.initSignalR();
    }
  }

  //
  // Listeners

  onResize = (dimensions) => {
    this.props.saveDimensions(dimensions);
  }

  //
  // Render

  render() {
    const {
      isPopulated,
      hasError,
      ...otherProps
    } = this.props;

    if (hasError) {
      return (
        <ErrorPage
          {...otherProps}
        />
      );
    }

    if (isPopulated) {
      return (
        <Page
          {...otherProps}
          onResize={this.onResize}
        />
      );
    }

    return (
      <LoadingPage />
    );
  }
}

PageConnector.propTypes = {
  isPopulated: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  initSignalR: PropTypes.func.isRequired,
  saveDimensions: PropTypes.func.isRequired,
  fetchSeries: PropTypes.func.isRequired,
  fetchTags: PropTypes.func.isRequired,
  fetchQualityProfiles: PropTypes.func.isRequired,
  fetchUISettings: PropTypes.func.isRequired,
  fetchStatus: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(PageConnector);
