import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import SelectInput from './SelectInput';

function createMapStateToProps() {
  return createSelector(
    (state) => state.rootFolders,
    (state, { includeNoChange }) => includeNoChange,
    (rootFolders, includeNoChange) => {
      const values = _.map(rootFolders.items, (rootFolder) => {
        return {
          [rootFolder.path]: rootFolder.path
        };
      });

      if (includeNoChange) {
        values.unshift({
          'noChange': 'No Change'
        });
      }

      return {
        values
      };
    }
  );
}

function RootFolderSelectInputConnector(props) {
  return (
    <SelectInput
      {...props}
    />
  );
}

RootFolderSelectInputConnector.propTypes = {
  includeNoChange: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

RootFolderSelectInputConnector.defaultProps = {
  includeNoChange: false
};

export default connect(createMapStateToProps)(RootFolderSelectInputConnector);
