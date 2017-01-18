import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createCommandsSelector from 'Store/Selectors/createCommandsSelector';
import createUISettingsSelector from 'Store/Selectors/createUISettingsSelector';
import { fetchTasks } from 'Store/Actions/systemActions';
import { executeCommand } from 'Store/Actions/commandActions';
import Tasks from './Tasks';

function createMapStateToProps() {
  return createSelector(
    (state) => state.system.tasks,
    createCommandsSelector(),
    createUISettingsSelector(),
    (tasks, commands, uiSettings) => {
      const {
        fetching
      } = tasks;

      const items = tasks.items.map((task) => {
        const executing = _.some(commands, { name: task.taskName });
        return Object.assign({}, task, { executing });
      });

      return {
        fetching,
        items,
        showRelativeDates: uiSettings.showRelativeDates,
        shortDateFormat: uiSettings.shortDateFormat,
        longDateFormat: uiSettings.longDateFormat,
        timeFormat: uiSettings.timeFormat
      };
    }
  );
}

const mapDispatchToProps = {
  fetchTasks,
  executeCommand
};

class TasksConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    this.props.fetchTasks();
  }

  //
  // Listeners

  onExecutePress = (name) => {
    this.props.executeCommand({ name });
  }

  //
  // Render

  render() {
    return (
      <Tasks
        onExecutePress={this.onExecutePress}
        {...this.props}
      />
    );
  }
}

TasksConnector.propTypes = {
  fetchTasks: PropTypes.func.isRequired,
  executeCommand: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(TasksConnector);
