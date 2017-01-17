import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createAllSeriesSelector from 'Store/Selectors/createAllSeriesSelector';
import SeriesSearchInput from './SeriesSearchInput';

function createMapStateToProps() {
  return createSelector(
    createAllSeriesSelector(),
    (series) => {
      return {
        series: _.sortBy(series, 'sortTitle')
      };
    }
  );
}

function SeriesSearchInputConnector(props) {
  return (
    <SeriesSearchInput
      {...props}
    />
  );
}

export default connect(createMapStateToProps)(SeriesSearchInputConnector);
