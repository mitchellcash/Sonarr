import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createExistingSeriesSelector from 'Store/Selectors/createExistingSeriesSelector';
import ImportSeriesSearchResult from './ImportSeriesSearchResult';

function createMapStateToProps() {
  return createSelector(
    createExistingSeriesSelector(),
    (isExistingSeries) => {
      return {
        isExistingSeries
      };
    }
  );
}

function ImportSeriesSearchResultConnector(props) {
  return (
    <ImportSeriesSearchResult
      {...props}
    />
  );
}

ImportSeriesSearchResultConnector.propTypes = {
  tvdbId: PropTypes.number.isRequired
};

export default connect(createMapStateToProps)(ImportSeriesSearchResultConnector);
