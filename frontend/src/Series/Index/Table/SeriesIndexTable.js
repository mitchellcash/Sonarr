import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Measure from 'react-measure';
import { Column, WindowScroller } from 'react-virtualized';
import { scrollDirections, sortDirections } from 'Helpers/Props';
import Scroller from 'Components/Scroller';
import VirtualTable from 'Components/Table/VirtualTable';
import { headerRenderer } from 'Components/Table/VirtualTableHeaderCell';
import seriesIndexCellRenderers from './seriesIndexCellRenderers';
import styles from './SeriesIndexTable.css';

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

class SeriesIndexTable extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      width: 0
    };

    this._table = null;
  }

  componentDidMount() {
    this._contentBodyNode = ReactDOM.findDOMNode(this.props.contentBody);
  }

  //
  // Control

  rowGetter = ({ index }) => {
    return this.props.items[index];
  }

  //
  // Listeners

  onMeasure = ({ width }) => {
    this.setState({
      width
    });
  }

  //
  // Render

  render() {
    const {
      items,
      sortKey,
      sortDirection,
      isSmallScreen,
      onSortPress
    } = this.props;

    const {
      width
    } = this.state;

    return (
      <Measure onMeasure={this.onMeasure}>
        <WindowScroller
          scrollElement={isSmallScreen ? null : this._contentBodyNode}
        >
          {({ height, isScrolling, scrollTop }) => {
            return (
              <Scroller
                className={styles.tableContainer}
                scrollDirection={scrollDirections.HORIZONTAL}
              >
                <VirtualTable
                  autoHeight={true}
                  headerHeight={38}
                  height={height}
                  overscanRowCount={2}
                  rowClassName={styles.row}
                  rowHeight={38}
                  rowGetter={this.rowGetter}
                  rowCount={items.length}
                  width={width}
                  scrollTop={scrollTop}
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
                          disableSort={!sortable}
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
              </Scroller>
            );
          }
        }
        </WindowScroller>
      </Measure>
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
