import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Measure from 'react-measure';
import { Grid, WindowScroller } from 'react-virtualized';
import { forceCheck } from 'react-lazyload';
import { sortDirections } from 'Helpers/Props';
import SeriesIndexItemConnector from 'Series/Index/SeriesIndexItemConnector';
import SeriesIndexPoster from './SeriesIndexPoster';

// Poster container dimensions
const columnWidth = 182;
const rowHeight = 291;

class SeriesIndexPosters extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      width: 0,
      columnCount: 1
    };

    this._grid = null;
  }

  componentDidMount() {
    this._contentBodyNode = ReactDOM.findDOMNode(this.props.contentBody);
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
      forceCheck();
      this._grid.recomputeGridSize();
    }
  }

  //
  // Control

  setGridRef = (ref) => {
    this._grid = ref;
  }

  cellRenderer = ({ key, rowIndex, columnIndex, style }) => {
    const {
      items,
      showRelativeDates,
      shortDateFormat,
      timeFormat
    } = this.props;

    const series = items[rowIndex * this.state.columnCount + columnIndex];

    if (!series) {
      return null;
    }

    return (
      <SeriesIndexItemConnector
        key={key}
        component={SeriesIndexPoster}
        showRelativeDates={showRelativeDates}
        shortDateFormat={shortDateFormat}
        timeFormat={timeFormat}
        style={style}
        {...series}
      />
    );
  }

  //
  // Listeners

  onMeasure = ({ width }) => {
    const columnCount = Math.max(Math.floor(width / columnWidth), 1);

    this.setState({
      width,
      columnCount
    });
  }

  //
  // Render

  render() {
    const {
      items,
      isSmallScreen
    } = this.props;

    const {
      width,
      columnCount
    } = this.state;

    const rowCount = Math.ceil(items.length / columnCount);

    return (
      <Measure onMeasure={this.onMeasure}>
        <WindowScroller
          scrollElement={isSmallScreen ? null : this._contentBodyNode}
        >
          {({ height, isScrolling, scrollTop }) => {
            return (
              <Grid
                ref={this.setGridRef}
                autoHeight={true}
                height={height}
                columnCount={columnCount}
                columnWidth={columnWidth}
                rowCount={rowCount}
                rowHeight={rowHeight}
                width={width}
                scrollTop={scrollTop}
                overscanRowCount={2}
                cellRenderer={this.cellRenderer}
              />
            );
          }
        }
        </WindowScroller>
      </Measure>
    );
  }
}

SeriesIndexPosters.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterKey: PropTypes.string,
  filterValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
  sortKey: PropTypes.string,
  sortDirection: PropTypes.oneOf(sortDirections.all),
  contentBody: PropTypes.object.isRequired,
  showRelativeDates: PropTypes.bool.isRequired,
  shortDateFormat: PropTypes.string.isRequired,
  isSmallScreen: PropTypes.bool.isRequired,
  timeFormat: PropTypes.string.isRequired
};

export default SeriesIndexPosters;
