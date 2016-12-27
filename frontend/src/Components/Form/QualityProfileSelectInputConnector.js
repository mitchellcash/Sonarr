import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import SelectInput from './SelectInput';

function createMapStateToProps() {
  return createSelector(
    (state) => state.settings.qualityProfiles,
    (state, { includeNoChange }) => includeNoChange,
    (qualityProfiles, includeNoChange) => {
      const values = _.map(qualityProfiles.items, (qualityProfile) => {
        return {
          [qualityProfile.id]: qualityProfile.name
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

class QualityProfileSelectInputConnector extends Component {

  //
  // Listeners

  onChange = ({ name, value }) => {
    this.props.onChange({ name, value: parseInt(value) });
  }

  //
  // Render

  render() {
    return (
      <SelectInput
        {...this.props}
        onChange={this.onChange}
      />
    );
  }
}

QualityProfileSelectInputConnector.propTypes = {
  includeNoChange: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

QualityProfileSelectInputConnector.defaultProps = {
  includeNoChange: false
};

export default connect(createMapStateToProps)(QualityProfileSelectInputConnector);
