import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { fetchRootFolders, addRootFolder, deleteRootFolder } from 'Stores/Actions/rootFolderActions';
import ImportSeriesSelectFolder from './ImportSeriesSelectFolder';

function createMapStateToProps() {
  return createSelector(
    (state) => state.rootFolders,
    (rootFolders) => {
      return rootFolders;
    }
  );
}

const mapDispatchToProps = {
  fetchRootFolders,
  addRootFolder,
  deleteRootFolder
};

class ImportSeriesSelectFolderConnector extends Component {

  //
  // Lifecycle

  componentDidMount() {
    this.props.fetchRootFolders();
  }

  //
  // Listeners

  onNewRootFolderSelect = (path) => {
    this.props.addRootFolder({ path });
  }

  onDeleteRootFolderPress = (id) => {
    this.props.deleteRootFolder({ id });
  }

  //
  // Render

  render() {
    return (
      <ImportSeriesSelectFolder
        {...this.props}
        onNewRootFolderSelect={this.onNewRootFolderSelect}
        onDeleteRootFolderPress={this.onDeleteRootFolderPress}
      />
    );
  }
}

ImportSeriesSelectFolderConnector.propTypes = {
  fetchRootFolders: PropTypes.func.isRequired,
  addRootFolder: PropTypes.func.isRequired,
  deleteRootFolder: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(ImportSeriesSelectFolderConnector);
