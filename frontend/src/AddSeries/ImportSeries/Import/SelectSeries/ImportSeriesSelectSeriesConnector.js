import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { queueLookupSeries, setImportSeriesValue } from 'Stores/Actions/importSeriesActions';
import ImportSeriesSelectSeries from './ImportSeriesSelectSeries';

function createMapStateToProps() {
  return createSelector(
    (state, { name }) => name,
    (state) => state.importSeries,
    (name, importSeries) => {
      const item = _.find(importSeries.items, { id: name });

      return item;
    }
  );
}

const mapDispatchToProps = {
  queueLookupSeries,
  setImportSeriesValue
};

class ImportSeriesSelectSeriesConnector extends Component {

  //
  // Listeners

  onSearchInputChange = (term) => {
    this.props.queueLookupSeries({
      name: this.props.name,
      term
    });
  }

  onSeriesSelect = (tvdbId) => {
    const {
      name: id,
      items
    } = this.props;

    this.props.setImportSeriesValue({
      id,
      selectedSeries: _.find(items, { tvdbId })
    });
  }

  //
  // Render

  render() {
    return (
      <ImportSeriesSelectSeries
        {...this.props}
        onSearchInputChange={this.onSearchInputChange}
        onSeriesSelect={this.onSeriesSelect}
      />
    );
  }
}

ImportSeriesSelectSeriesConnector.propTypes = {
  name: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  queueLookupSeries: PropTypes.func.isRequired,
  setImportSeriesValue: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(ImportSeriesSelectSeriesConnector);
