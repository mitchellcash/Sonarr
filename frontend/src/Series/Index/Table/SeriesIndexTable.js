import React, { PropTypes } from 'react';
import { Column } from 'react-virtualized';
import { sortDirections } from 'Helpers/Props';
import VirtualTable from 'Components/Table/VirtualTable';
import { headerRenderer } from 'Components/Table/VirtualTableHeaderCell';
import seriesIndexCellRenderers from './seriesIndexCellRenderers';

const columns = [
  {
    name: 'status',
    label: '',
    width: 60
  },
  {
    name: 'sortTitle',
    label: 'Series Title',
    sortable: true,
    width: 110,
    flexGrow: 3
  },
  {
    name: 'network',
    label: 'Network',
    sortable: true,
    width: 90,
    flexGrow: 2
  },
  {
    name: 'qualityProfileId',
    label: 'Quality Profile',
    sortable: true,
    width: 125,
    flexGrow: 1
  },
  {
    name: 'nextAiring',
    label: 'Next Airing',
    sortable: true,
    width: 180
  },
  // {
  //   name: 'previousAiring',
  //   label: 'Previous Airing',
  //   sortable: true,
  //   width: 180
  // },
  {
    name: 'seasonCount',
    label: 'Seasons',
    sortable: true,
    width: 100
  },
  {
    name: 'episodeProgress',
    label: 'Episodes',
    sortable: true,
    width: 150
  },
  {
    name: 'actions',
    label: 'Actions',
    width: 70
  }
];

function SeriesIndexTable(props) {
  const {
    items,
    sortKey,
    sortDirection,
    isSmallScreen,
    contentBody,
    onSortPress
  } = props;

  return (
    <VirtualTable
      items={items}
      contentBody={contentBody}
      isSmallScreen={isSmallScreen}
    >
      {
        columns.map((column) => {
          const {
            name,
            label,
            sortable,
            width: columnWidth,
            flexGrow
          } = column;

          return (
            <Column
              key={name}
              dataKey={name}
              label={label}
              width={columnWidth}
              flexGrow={flexGrow}
              flexShrink={0}
              columnData={{
                sortable,
                sortKey,
                sortDirection,
                onSortPress
              }}
              cellRenderer={seriesIndexCellRenderers}
              headerRenderer={headerRenderer}
            />
          );
        })
      }
    </VirtualTable>
  );
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
