import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { fetchUpdates } from 'Store/Actions/systemActions';
import { executeCommand } from 'Store/Actions/commandActions';
import createUiSettingsSelector from 'Store/Selectors/createUiSettingsSelector';
import * as commandNames from 'Commands/commandNames';
import Updates from './Updates';

function createMapStateToProps() {
  return createSelector(
    (state) => state.system.updates,
    createUiSettingsSelector(),
    (updates, uiSettings) => {
      const {
        fetching,
        items
      } = updates;

      return {
        fetching,
        items,
        shortDateFormat: uiSettings.shortDateFormat
      };
    }
  );
}

const mapDispatchToProps = {
  fetchUpdates,
  executeCommand
};

class UpdatesConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    this.props.fetchUpdates();
  }

  //
  // Listeners

  onInstallLatestPress = () => {
    this.props.executeCommand({ name: commandNames.APPLICATION_UPDATE });
  }

  //
  // Render

  render() {
    return (
      <Updates
        onInstallLatestPress={this.onInstallLatestPress}
        {...this.props}
      />
    );
  }
}

UpdatesConnector.propTypes = {
  fetchUpdates: PropTypes.func.isRequired,
  executeCommand: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(UpdatesConnector);
