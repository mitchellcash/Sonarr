import React, { Component, PropTypes } from 'react';
import { sortDirections } from 'Helpers/Props';
import VirtualTable from 'Components/Table/VirtualTable';
import SeriesIndexItemConnector from 'Series/Index/SeriesIndexItemConnector';
import SeriesIndexHeader from './SeriesIndexHeader';
import SeriesIndexRow from './SeriesIndexRow';

class SeriesIndexTable extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this._table = null;
  }

  componentDidUpdate(prevProps) {
    const {
      filterKey,
      filterValue,
      sortKey,
      sortDirection
    } = this.props;

    if (prevProps.filterKey !== filterKey ||
        prevProps.filterValue !== filterValue ||
        prevProps.sortKey !== sortKey ||
        prevProps.sortDirection !== sortDirection
    ) {
      this._table.forceUpdateGrid();
    }
  }

  //
  // Control

  setTableRef = (ref) => {
    this._table = ref;
  }

  rowRenderer = ({ key, rowIndex, style }) => {
    const {
      items
    } = this.props;

    const series = items[rowIndex];

    return (
      <SeriesIndexItemConnector
        key={key}
        component={SeriesIndexRow}
        style={style}
        {...series}
      />
    );
  }

  //
  // Render

  render() {
    const {
      items,
      sortKey,
      sortDirection,
      isSmallScreen,
      contentBody,
      onSortPress
    } = this.props;

    return (
      <VirtualTable
        ref={this.setTableRef}
        items={items}
        contentBody={contentBody}
        isSmallScreen={isSmallScreen}
        rowHeight={38}
        rowRenderer={this.rowRenderer}
        header={
          <SeriesIndexHeader
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSortPress={onSortPress}
          />
        }
      />
    );
  }
}

SeriesIndexTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterKey: PropTypes.string,
  filterValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
  sortKey: PropTypes.string,
  sortDirection: PropTypes.oneOf(sortDirections.all),
  contentBody: PropTypes.object.isRequired,
  isSmallScreen: PropTypes.bool.isRequired,
  onSortPress: PropTypes.func.isRequired
};

export default SeriesIndexTable;
