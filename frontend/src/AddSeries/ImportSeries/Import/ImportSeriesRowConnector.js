import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { queueLookupSeries, setImportSeriesValue } from 'Store/Actions/importSeriesActions';
import createAllSeriesSelector from 'Store/Selectors/createAllSeriesSelector';
import ImportSeriesRow from './ImportSeriesRow';

function createMapStateToProps() {
  return createSelector(
    (state, { name }) => name,
    (state) => state.addSeries,
    (state) => state.importSeries,
    createAllSeriesSelector(),
    (name, addSeries, importSeries, series) => {
      const item = _.find(importSeries.items, { id: name }) || {};
      const selectedSeries = item && item.selectedSeries;
      const isExistingSeries = !!selectedSeries && _.some(series, { tvdbId: selectedSeries.tvdbId });

      return {
        defaultMonitor: addSeries.defaults.monitor,
        defaultQualityProfileId: addSeries.defaults.qualityProfileId,
        defaultSeriesType: addSeries.defaults.seriesType,
        defaultSeasonFolder: addSeries.defaults.seasonFolder,
        ...item,
        isExistingSeries
      };
    }
  );
}

const mapDispatchToProps = {
  queueLookupSeries,
  setImportSeriesValue
};

class ImportSeriesRowConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    const {
      name,
      path,
      defaultMonitor,
      defaultQualityProfileId,
      defaultSeriesType,
      defaultSeasonFolder
    } = this.props;

    this.props.queueLookupSeries({
      name,
      path,
      term: name
    });

    const values = {
      id: name,
      monitor: defaultMonitor,
      qualityProfileId: defaultQualityProfileId,
      seriesType: defaultSeriesType,
      seasonFolder: defaultSeasonFolder
    };

    this.props.setImportSeriesValue(values);
  }

  //
  // Listeners

  onInputChange = ({ name, value }) => {
    this.props.setImportSeriesValue({
      id: this.props.name,
      [name]: value
    });
  }

  //
  // Render

  render() {
    // Don't show the row until we have the information we require for it.

    if (!this.props.items) {
      return null;
    }

    return (
      <ImportSeriesRow
        {...this.props}
        onInputChange={this.onInputChange}
        onSeriesSelect={this.onSeriesSelect}
      />
    );
  }
}

ImportSeriesRowConnector.propTypes = {
  rootFolderId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  monitor: PropTypes.string,
  qualityProfileId: PropTypes.number,
  defaultMonitor: PropTypes.string.isRequired,
  defaultQualityProfileId: PropTypes.number,
  defaultSeriesType: PropTypes.string.isRequired,
  defaultSeasonFolder: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  queueLookupSeries: PropTypes.func.isRequired,
  setImportSeriesValue: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(ImportSeriesRowConnector);
