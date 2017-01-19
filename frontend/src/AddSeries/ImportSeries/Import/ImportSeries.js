import React, { Component, PropTypes } from 'react';
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import selectAll from 'Utilities/Table/selectAll';
import toggleSelected from 'Utilities/Table/toggleSelected';
import LoadingIndicator from 'Components/LoadingIndicator';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import ImportSeriesRowConnector from './ImportSeriesRowConnector';
import ImportSeriesFooterConnector from './ImportSeriesFooterConnector';

const headers = [
  {
    name: 'folder',
    label: 'Folder'
  },
  {
    name: 'monitor',
    label: 'Monitor'
  },
  {
    name: 'qualityProfile',
    label: 'Quality Profile'
  },
  {
    name: 'seriesType',
    label: 'Series Type'
  },
  {
    name: 'seasonFolder',
    label: 'Season Folder'
  },
  {
    name: 'series',
    label: 'Series'
  }
];

class ImportSeries extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      allSelected: false,
      allUnselected: false,
      lastToggled: null,
      selectedState: {}
    };
  }

  //
  // Listeners

  getSelectedIds = () => {
    return getSelectedIds(this.state.selectedState, { parseIds: false });
  }

  onSelectAllChange = ({ value }) => {
    // Only select non-dupes
    this.setState(selectAll(this.state.selectedState, value));
  }

  onSelectedChange = ({ id, value, shiftKey = false }) => {
    this.setState((state) => {
      return toggleSelected(state, this.props.unmappedFolders, id, value, shiftKey);
    });
  }

  onInputChange = ({ name, value }) => {
    this.props.onInputChange(this.getSelectedIds(), name, value);
  }

  onImportPress = () => {
    this.props.onImportPress(this.getSelectedIds());
  }

  //
  // Render

  render() {
    const {
      rootFolderId,
      rootFoldersFetching,
      rootFoldersPopulated,
      rootFoldersError,
      unmappedFolders
    } = this.props;

    const {
      allSelected,
      allUnselected,
      selectedState
    } = this.state;

    return (
      <PageContent title="Import Series">
        <PageContentBody>
          {
            rootFoldersFetching && !rootFoldersPopulated &&
              <LoadingIndicator />
          }

          {
            !rootFoldersFetching && !!rootFoldersError &&
              <div>Unable to load root folders</div>
          }

          {
            !rootFoldersError && rootFoldersPopulated &&
              <Table
                headers={headers}
                selectAll={true}
                allSelected={allSelected}
                allUnselected={allUnselected}
                onSelectAllChange={this.onSelectAllChange}
              >
                <TableBody>
                  {
                    unmappedFolders.map((unmappedFolder) => {
                      return (
                        <ImportSeriesRowConnector
                          key={unmappedFolder.name}
                          rootFolderId={rootFolderId}
                          name={unmappedFolder.name}
                          path={unmappedFolder.path}
                          isSelected={selectedState[unmappedFolder.name]}
                          onSelectedChange={this.onSelectedChange}
                        />
                      );
                    })
                  }
                </TableBody>
              </Table>
          }
        </PageContentBody>

        <ImportSeriesFooterConnector
          selectedCount={this.getSelectedIds().length}
          onInputChange={this.onInputChange}
          onImportPress={this.onImportPress}
        />
      </PageContent>
    );
  }
}

ImportSeries.propTypes = {
  rootFolderId: PropTypes.number.isRequired,
  rootFoldersFetching: PropTypes.bool.isRequired,
  rootFoldersPopulated: PropTypes.bool.isRequired,
  rootFoldersError: PropTypes.object,
  unmappedFolders: PropTypes.arrayOf(PropTypes.object),
  onInputChange: PropTypes.func.isRequired,
  onImportPress: PropTypes.func.isRequired
};

ImportSeries.defaultProps = {
  unmappedFolders: []
};

export default ImportSeries;
