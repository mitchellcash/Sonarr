import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createExistingSeriesSelector from 'Store/Selectors/createExistingSeriesSelector';
import AddNewSeriesSearchResult from './AddNewSeriesSearchResult';

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

function AddNewSeriesSearchResultConnector(props) {
  return (
    <AddNewSeriesSearchResult
      {...props}
    />
  );
}

AddNewSeriesSearchResultConnector.propTypes = {
  tvdbId: PropTypes.number.isRequired
};

export default connect(createMapStateToProps)(AddNewSeriesSearchResultConnector);
