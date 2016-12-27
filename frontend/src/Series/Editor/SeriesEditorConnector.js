import React, { Component, PropTypes } from 'react';
import { createSelector } from 'reselect';
import connectSection from 'Stores/connectSection';
import createClientSideCollectionSelector from 'Stores/Selectors/createClientSideCollectionSelector';
import createCommandSelector from 'Stores/Selectors/createCommandSelector';
import { setSeriesEditorSort, setSeriesEditorFilter, saveSeriesEditor } from 'Stores/Actions/seriesEditorActions';
import { fetchRootFolders } from 'Stores/Actions/rootFolderActions';
import commandNames from 'Commands/commandNames';
import SeriesEditor from './SeriesEditor';

function createMapStateToProps() {
  return createSelector(
    createClientSideCollectionSelector(),
    createCommandSelector(commandNames.RENAME_SERIES),
    (series, isOrganizingSeries) => {
      return {
        isOrganizingSeries,
        ...series
      };
    }
  );
}

const mapDispatchToProps = {
  setSeriesEditorSort,
  setSeriesEditorFilter,
  saveSeriesEditor,
  fetchRootFolders
};

class SeriesEditorConnector extends Component {

  //
  // Lifecycle

  componentDidMount() {
    this.props.fetchRootFolders();
  }

  //
  // Listeners

  onSortPress = (sortKey) => {
    this.props.setSeriesEditorSort({ sortKey });
  }

  onFilterSelect = (filterKey, filterValue, filterType) => {
    this.props.setSeriesEditorFilter({ filterKey, filterValue, filterType });
  }

  onSaveSelectedPress = (payload) => {
    this.props.saveSeriesEditor(payload);
  }

  //
  // Render

  render() {
    return (
      <SeriesEditor
        {...this.props}
        onSortPress={this.onSortPress}
        onFilterSelect={this.onFilterSelect}
        onSaveSelectedPress={this.onSaveSelectedPress}
      />
    );
  }
}

SeriesEditorConnector.propTypes = {
  setSeriesEditorSort: PropTypes.func.isRequired,
  setSeriesEditorFilter: PropTypes.func.isRequired,
  saveSeriesEditor: PropTypes.func.isRequired,
  fetchRootFolders: PropTypes.func.isRequired
};

export default connectSection(
                createMapStateToProps,
                mapDispatchToProps,
                undefined,
                undefined,
                { section: 'series', uiSection: 'seriesEditor' }
              )(SeriesEditorConnector);
