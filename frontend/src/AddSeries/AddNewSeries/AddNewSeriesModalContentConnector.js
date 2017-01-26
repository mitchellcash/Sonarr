import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { setAddSeriesDefault, addSeries } from 'Store/Actions/addSeriesActions';
import AddNewSeriesModalContent from './AddNewSeriesModalContent';

function createMapStateToProps() {
  return createSelector(
    (state) => state.addSeries,
    (addSeriesState) => {
      const {
        isAdding,
        addError,
        defaults
      } = addSeriesState;

      return {
        isAdding,
        addError,
        ...defaults
      };
    }
  );
}

const mapDispatchToProps = {
  setAddSeriesDefault,
  addSeries
};

class AddNewSeriesModalContentConnector extends Component {

  //
  // Lifecycle

  componentWillReceiveProps(nextProps) {
    if (this.props.isAdding && !nextProps.isAdding && !nextProps.error) {
      this.props.onModalClose();
    }
  }

  //
  // Listeners

  onInputChange = ({ name, value }) => {
    this.props.setAddSeriesDefault({ [name]: value });
  }

  onAddSeriesPress = (searchForMissingEpisodes) => {
    const {
      tvdbId,
      rootFolder,
      monitor,
      qualityProfileId,
      seriesType,
      seasonFolder
    } = this.props;

    this.props.addSeries({
      tvdbId,
      rootFolder,
      monitor,
      qualityProfileId,
      seriesType,
      seasonFolder,
      searchForMissingEpisodes
    });
  }

  //
  // Render

  render() {
    return (
      <AddNewSeriesModalContent
        {...this.props}
        onInputChange={this.onInputChange}
        onAddSeriesPress={this.onAddSeriesPress}
      />
    );
  }
}

AddNewSeriesModalContentConnector.propTypes = {
  tvdbId: PropTypes.number.isRequired,
  rootFolder: PropTypes.string,
  monitor: PropTypes.string.isRequired,
  qualityProfileId: PropTypes.number,
  seriesType: PropTypes.string.isRequired,
  seasonFolder: PropTypes.bool.isRequired,
  isAdding: PropTypes.bool.isRequired,
  addError: PropTypes.object,
  onModalClose: PropTypes.func.isRequired,
  setAddSeriesDefault: PropTypes.func.isRequired,
  addSeries: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(AddNewSeriesModalContentConnector);
