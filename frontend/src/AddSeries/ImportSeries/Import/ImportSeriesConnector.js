import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { setImportSeriesValue, importSeries, clearImportSeries } from 'Store/Actions/importSeriesActions';
import { fetchRootFolders } from 'Store/Actions/rootFolderActions';
import ImportSeries from './ImportSeries';

function createMapStateToProps() {
  return createSelector(
    (state, { rootFolderId }) => rootFolderId,
    (state) => state.rootFolders,
    (state) => state.addSeries,
    (rootFolderId, rootFolders, addSeries) => {
      const {
        fetching: rootFoldersFetching,
        populated: rootFoldersPopulated,
        error: rootFoldersError,
        items
      } = rootFolders;

      const result = {
        rootFoldersFetching,
        rootFoldersPopulated,
        rootFoldersError
      };

      if (items.length) {
        const rootFolder = _.find(items, { id: rootFolderId });

        return {
          ...result,
          ...rootFolder
        };
      }

      return result;
    }
  );
}

const mapDispatchToProps = {
  setImportSeriesValue,
  importSeries,
  clearImportSeries,
  fetchRootFolders
};

class ImportSeriesConnector extends Component {

  //
  // Lifecycle

  componentDidMount() {
    if (!this.props.rootFoldersPopulated) {
      this.props.fetchRootFolders();
    }
  }

  componentWillUnmount() {
    this.props.clearImportSeries();
  }

  //
  // Listeners

  onInputChange = (ids, name, value) => {
    ids.forEach((id) => {
      this.props.setImportSeriesValue({
        id,
        [name]: value
      });
    });
  }

  onImportPress = (ids) => {
    this.props.importSeries({ ids });
  }

  //
  // Render

  render() {
    return (
      <ImportSeries
        {...this.props}
        onInputChange={this.onInputChange}
        onImportPress={this.onImportPress}
      />
    );
  }
}

ImportSeriesConnector.propTypes = {
  rootFoldersPopulated: PropTypes.bool.isRequired,
  setImportSeriesValue: PropTypes.func.isRequired,
  importSeries: PropTypes.func.isRequired,
  clearImportSeries: PropTypes.func.isRequired,
  fetchRootFolders: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(ImportSeriesConnector);
