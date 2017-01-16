import React, { Component, PropTypes } from 'react';
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import selectAll from 'Utilities/Table/selectAll';
import toggleSelected from 'Utilities/Table/toggleSelected';
import { align, sortDirections } from 'Helpers/Props';
import LoadingIndicator from 'Components/LoadingIndicator';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import FilterMenu from 'Components/Menu/FilterMenu';
import MenuContent from 'Components/Menu/MenuContent';
import FilterMenuItem from 'Components/Menu/FilterMenuItem';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import SeasonPassRowConnector from './SeasonPassRowConnector';
import SeasonPassFooter from './SeasonPassFooter';

const headers = [
  {
    name: 'status',
    label: ''
  },
  {
    name: 'sortTitle',
    label: 'Title',
    sortable: true
  },
  {
    name: 'monitored',
    label: ''
  },
  {
    name: 'seasonCount',
    label: 'Seasons',
    sortable: true
  }
];

class SeasonPass extends Component {

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

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isSaving && this.props.isSaving && !nextProps.saveError) {
      this.onSelectAllChange({ value: false });
    }
  }

  //
  // Control

  getSelectedIds = () => {
    return getSelectedIds(this.state.selectedState);
  }

  //
  // Listeners

  onSelectAllChange = ({ value }) => {
    this.setState(selectAll(this.state.selectedState, value));
  }

  onSelectedChange = ({ id, value, shiftKey = false }) => {
    this.setState((state) => {
      return toggleSelected(state, this.props.items, id, value, shiftKey);
    });
  }

  onUpdateSelectedPress = (changes) => {
    this.props.onUpdateSelectedPress({
      seriesIds: this.getSelectedIds(),
      ...changes
    });
  }

  //
  // Render

  render() {
    const {
      fetching,
      populated,
      error,
      items,
      filterKey,
      filterValue,
      sortKey,
      sortDirection,
      isSaving,
      saveError,
      onSortPress,
      onFilterSelect
    } = this.props;

    const {
      allSelected,
      allUnselected,
      selectedState
    } = this.state;

    return (
      <PageContent>
        <PageToolbar>
          <PageToolbarSection />
          <PageToolbarSection alignContent={align.RIGHT}>
            <FilterMenu>
              <MenuContent alignMenu={align.RIGHT}>
                <FilterMenuItem
                  filterKey={filterKey}
                  filterValue={filterValue}
                  onPress={onFilterSelect}
                >
                  All
                </FilterMenuItem>

                <FilterMenuItem
                  name="monitored"
                  value={true}
                  filterKey={filterKey}
                  filterValue={filterValue}
                  onPress={onFilterSelect}
                >
                  Monitored Only
                </FilterMenuItem>

                <FilterMenuItem
                  name="status"
                  value="continuing"
                  filterKey={filterKey}
                  filterValue={filterValue}
                  onPress={onFilterSelect}
                >
                  Continuing Only
                </FilterMenuItem>

                <FilterMenuItem
                  name="status"
                  value="ended"
                  filterKey={filterKey}
                  filterValue={filterValue}
                  onPress={onFilterSelect}
                >
                  Ended Only
                </FilterMenuItem>

                <FilterMenuItem
                  name="missing"
                  value={true}
                  filterKey={filterKey}
                  filterValue={filterValue}
                  onPress={onFilterSelect}
                >
                  Missing Episodes
                </FilterMenuItem>
              </MenuContent>
            </FilterMenu>
          </PageToolbarSection>
        </PageToolbar>

        <PageContentBody>
          {
            fetching && !populated &&
              <LoadingIndicator />
          }

          {
            !fetching && !!error &&
              <div>Unable to load the calendar</div>
          }

          {
            !error && populated && !!items.length &&
              <div>
                <Table
                  headers={headers}
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  selectAll={true}
                  allSelected={allSelected}
                  allUnselected={allUnselected}
                  onSortPress={onSortPress}
                  onSelectAllChange={this.onSelectAllChange}
                >
                  <TableBody>
                    {
                      items.map((item) => {
                        return (
                          <SeasonPassRowConnector
                            key={item.id}
                            seriesId={item.id}
                            isSelected={selectedState[item.id]}
                            onSelectedChange={this.onSelectedChange}
                          />
                        );
                      })
                    }
                  </TableBody>
                </Table>
              </div>
          }

          {
            !error && populated && !items.length &&
              <div>
                No series found, import existing series or add a new series
              </div>
          }
        </PageContentBody>

        <SeasonPassFooter
          selectedCount={this.getSelectedIds().length}
          isSaving={isSaving}
          saveError={saveError}
          onUpdateSelectedPress={this.onUpdateSelectedPress}
        />
      </PageContent>
    );
  }
}

SeasonPass.propTypes = {
  fetching: PropTypes.bool.isRequired,
  populated: PropTypes.bool.isRequired,
  error: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortKey: PropTypes.string,
  sortDirection: PropTypes.oneOf(sortDirections.all),
  filterKey: PropTypes.string,
  filterValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
  isSaving: PropTypes.bool.isRequired,
  saveError: PropTypes.object,
  onSortPress: PropTypes.func.isRequired,
  onFilterSelect: PropTypes.func.isRequired,
  onUpdateSelectedPress: PropTypes.func.isRequired
};

export default SeasonPass;
