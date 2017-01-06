import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { fetchSeries } from 'Store/Actions/seriesActions';
import { fetchTags } from 'Store/Actions/tagActions';
import { fetchQualityProfiles } from 'Store/Actions/settingsActions';
import App from './App';

function getLoadingState(state, prefix) {
  const populatedPrefix = prefix.charAt(0).toUpperCase() + prefix.substr(1);

  return {
    [`is${populatedPrefix}Populated`]: state.populated,
    [`${prefix}Error`]: state.error
  };
}

function createMapStateToProps() {
  return createSelector(
    (state) => state.series,
    (state) => state.tags,
    (state) => state.settings.qualityProfiles,
    (series, tags, qualityProfiles) => {
      const seriesLoadingState = getLoadingState(series, 'series');
      const tagsLoadingState = getLoadingState(tags, 'tags');
      const qualityProfilesLoadingState = getLoadingState(qualityProfiles, 'qualityProfiles');

      return {
        ...seriesLoadingState,
        ...tagsLoadingState,
        ...qualityProfilesLoadingState
      };
    }
  );
}

const mapDispatchToProps = {
  fetchSeries,
  fetchTags,
  fetchQualityProfiles
};

class AppConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    this.props.fetchSeries();
    this.props.fetchTags();
    this.props.fetchQualityProfiles();
  }

  //
  // Render

  render() {
    return (
      <App
        {...this.props}
      />
    );
  }
}

AppConnector.propTypes = {
  fetchSeries: PropTypes.func.isRequired,
  fetchTags: PropTypes.func.isRequired,
  fetchQualityProfiles: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(AppConnector);
