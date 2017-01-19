import React, { Component, PropTypes } from 'react';
import { kinds, sizes } from 'Helpers/Props';
import Button from 'Components/Button';
import FieldSet from 'Components/FieldSet';
import Icon from 'Components/Icon';
import LoadingIndicator from 'Components/LoadingIndicator';
import FileBrowserModal from 'Components/FileBrowser/FileBrowserModal';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import ImportSeriesRootFolderRowConnector from './ImportSeriesRootFolderRowConnector';
import styles from './ImportSeriesSelectFolder.css';

const rootFoldersHeaders = [
  {
    name: 'path',
    label: 'Path'
  },
  {
    name: 'freeSpace',
    label: 'Free Space'
  },
  {
    name: 'unmappedFolders',
    label: 'Unmapped Folders'
  },
  {
    name: 'actions',
    label: ''
  }
];

class ImportSeriesSelectFolder extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isAddNewRootFolderModalOpen: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isSaving && this.props.isSaving && !nextProps.saveError) {
      // TODO: find the new item and navigate to that page
    }
  }

  //
  // Lifecycle

  onAddNewRootFolderPress = () => {
    this.setState({ isAddNewRootFolderModalOpen: true });
  }

  onNewRootFolderSelect = ({ value }) => {
    this.props.onNewRootFolderSelect(value);
  }

  onAddRootFolderModalClose = () => {
    this.setState({ isAddNewRootFolderModalOpen: false });
  }

  //
  // Render

  render() {
    const {
      fetching,
      populated,
      error,
      items
    } = this.props;

    return (
      <PageContent title="Import Series">
        <PageContentBody>
          {
            fetching && !populated &&
              <LoadingIndicator />
          }

          {
            !fetching && !!error &&
              <div>Unable to load root folders</div>
          }

          {
            !error && populated &&
              <div>
                <div className={styles.header}>
                  Import series you already have
                </div>

                <div className={styles.tips}>
                  Some tips to ensure the import goes smoothly:
                  <ul>
                    <li className={styles.tip}>
                      Make sure your files include the quality in the name. eg. <span className={styles.code}>episode.s02e15.bluray.mkv</span>
                    </li>
                    <li className={styles.tip}>
                      Point Sonarr to the folder containing all of your tv shows not a specific one. eg. <span className={styles.code}>"\tv shows\"</span> and not <span className={styles.code}>"\tv shows\the simpsons\"</span>
                    </li>
                  </ul>
                </div>

                {
                  items.length > 0 ?
                    <div className={styles.recentFolders}>
                      <FieldSet
                        legend="Recent Folders"
                      >
                        <Table
                          headers={rootFoldersHeaders}
                        >
                          <TableBody>
                            {
                              items.map((rootFolder) => {
                                return (
                                  <ImportSeriesRootFolderRowConnector
                                    key={rootFolder.id}
                                    id={rootFolder.id}
                                    path={rootFolder.path}
                                    freeSpace={rootFolder.freeSpace}
                                    unmappedFolders={rootFolder.unmappedFolders}
                                  />
                                );
                              })
                            }
                          </TableBody>
                        </Table>
                      </FieldSet>

                      <Button
                        kind={kinds.PRIMARY}
                        size={sizes.LARGE}
                        onPress={this.onAddNewRootFolderPress}
                      >
                        <Icon
                          className={styles.importButtonIcon}
                          name="fa fa-hdd-o"
                        />
                        Choose another folder
                      </Button>
                    </div> :

                    <div className={styles.startImport}>
                      <Button
                        kind={kinds.PRIMARY}
                        size={sizes.LARGE}
                        onPress={this.onAddNewRootFolderPress}
                      >
                        <Icon
                          className={styles.importButtonIcon}
                          name="fa fa-hdd-o"
                        />
                        Start Import
                      </Button>
                    </div>
                }

                <FileBrowserModal
                  isOpen={this.state.isAddNewRootFolderModalOpen}
                  name="rootFolderPath"
                  value=""
                  onChange={this.onNewRootFolderSelect}
                  onModalClose={this.onAddRootFolderModalClose}
                />
              </div>
          }
        </PageContentBody>
      </PageContent>
    );
  }
}

ImportSeriesSelectFolder.propTypes = {
  fetching: PropTypes.bool.isRequired,
  populated: PropTypes.bool.isRequired,
  error: PropTypes.object,
  isSaving: PropTypes.bool.isRequired,
  saveError: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onNewRootFolderSelect: PropTypes.func.isRequired,
  onDeleteRootFolderPress: PropTypes.func.isRequired
};

export default ImportSeriesSelectFolder;
