import React from 'react';
import { Grid, Table } from 'react-virtualized';
import classNames from 'classnames';
import styles from './VirtualTable.css';

function cellRangeRenderer(props) {
  const {
    cellCache,
    cellRenderer,
    columnSizeAndPositionManager,
    columnStartIndex,
    columnStopIndex,
    horizontalOffsetAdjustment,
    isScrolling,
    rowSizeAndPositionManager,
    rowStartIndex,
    rowStopIndex,
    scrollLeft,
    scrollTop,
    styleCache,
    verticalOffsetAdjustment,
    visibleColumnIndices,
    visibleRowIndices
  } = props;

  const renderedCells = [];
  const offsetAdjusted = verticalOffsetAdjustment || horizontalOffsetAdjustment;
  const canCacheStyle = !isScrolling || !offsetAdjusted;

  for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
    const rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex);

    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
      const columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex);
      const isVisible = rowIndex >= visibleRowIndices.start && rowIndex <= visibleRowIndices.stop;

      const key = `${rowIndex}-${columnIndex}`;
      let style = null;

      // Cache style objects so shallow-compare doesn't re-render unnecessarily.
      if (canCacheStyle && styleCache[key]) {
        style = styleCache[key];
      } else {
        style = {
          height: rowDatum.size,
          left: columnDatum.offset + horizontalOffsetAdjustment,
          position: 'absolute',
          top: rowDatum.offset + verticalOffsetAdjustment + 38,
          width: columnDatum.size
        };

        styleCache[key] = style;
      }

      const cellRendererParams = {
        columnIndex,
        isScrolling,
        isVisible,
        key,
        rowIndex,
        style
      };

      let renderedCell = null;

      // Avoid re-creating cells while scrolling.
      // This can lead to the same cell being created many times and can cause performance issues for "heavy" cells.
      // If a scroll is in progress- cache and reuse cells.
      // This cache will be thrown away once scrolling completes.
      // However if we are scaling scroll positions and sizes, we should also avoid caching.
      // This is because the offset changes slightly as scroll position changes and caching leads to stale values.
      // For more info refer to issue #395
      if (isScrolling && !horizontalOffsetAdjustment && !verticalOffsetAdjustment) {
        if (!cellCache[key]) {
          cellCache[key] = cellRenderer(cellRendererParams);
        }

        renderedCell = cellCache[key];

      // If the user is no longer scrolling, don't cache cells.
      // This makes dynamic cell content difficult for users and would also lead to a heavier memory footprint.
      } else {
        renderedCell = cellRenderer(cellRendererParams);
      }

      if (renderedCell != null || renderedCell === true) {
        renderedCells.push(renderedCell);
      }
    }
  }

  return renderedCells;
}

class TableComponent extends Table {

  //
  // Control

  _createColumn = (columnProps) => {
    const {
      column,
      columnIndex,
      isScrolling,
      rowData,
      rowIndex
    } = columnProps;

    const {
      cellRenderer,
      className,
      columnData,
      dataKey
    } = column.props;

    const style = this._cachedColumnStyles[columnIndex];

    const renderedCell = cellRenderer({
      cellKey: `Row${rowIndex}-Col${columnIndex}`,
      className,
      style,
      columnData,
      dataKey,
      isScrolling,
      rowData,
      rowIndex
    });

    return renderedCell;
  }

  //
  // Render

  render() {
    const {
      children,
      className,
      disableHeader,
      gridClassName,
      gridStyle,
      headerHeight,
      height,
      id,
      noRowsRenderer,
      rowClassName,
      rowStyle,
      scrollToIndex,
      style,
      width
    } = this.props;

    const { scrollbarWidth } = this.state;

    const availableRowsHeight = disableHeader ? height : height - headerHeight;

    const rowClass = rowClassName instanceof Function ? rowClassName({ index: -1 }) : rowClassName;
    const rowStyleObject = rowStyle instanceof Function ? rowStyle({ index: -1 }) : rowStyle;

    // Precompute and cache column styles before rendering rows and columns to speed things up
    this._cachedColumnStyles = [];
    React.Children.toArray(children).forEach((column, index) => {
      const flexStyles = this._getFlexStyleForColumn(column, column.props.style);

      this._cachedColumnStyles[index] = {
        ...flexStyles,
        overflow: 'hidden'
      };
    });

    // Note that we specify :rowCount, :scrollbarWidth, :sortBy, and :sortDirection as properties on Grid even though these have nothing to do with Grid.
    // This is done because Grid is a pure component and won't update unless its properties or state has changed.
    // Any property that should trigger a re-render of Grid then is specified here to avoid a stale display.
    return (
      <div
        className={classNames('ReactVirtualized__Table', className)}
        id={id}
        style={style}
      >
        {!disableHeader && (
          <div
            className={classNames(styles.headerRow, rowClass)}
            style={{
              ...rowStyleObject,
              height: headerHeight,
              overflow: 'hidden',
              paddingRight: scrollbarWidth,
              width
            }}
          >
            {this._getRenderedHeaderRow()}
          </div>
        )}

        <GridComponent
          {...this.props}
          autoContainerWidth={true}
          className={classNames('ReactVirtualized__Table__Grid', gridClassName)}
          cellRenderer={this._createRow}
          columnWidth={width}
          columnCount={1}
          height={availableRowsHeight}
          id={undefined}
          noContentRenderer={noRowsRenderer}
          onScroll={this._onScroll}
          onSectionRendered={this._onSectionRendered}
          ref={(ref) => {
            this.Grid = ref
          }}
          scrollbarWidth={scrollbarWidth}
          scrollToRow={scrollToIndex}
          style={{
            ...gridStyle,
            overflowX: 'hidden'
          }}
        />
      </div>
    )
  }
}

class GridComponent extends Grid {
  //
  // Render

  render() {
    const {
      autoContainerWidth,
      autoHeight,
      containerStyle,
      height,
      width
    } = this.props;

    const { isScrolling } = this.state;

    const gridStyle = {
      boxSizing: 'border-box',
      direction: 'ltr',
      height: autoHeight ? 'auto' : height,
      position: 'relative',
      width,
      WebkitOverflowScrolling: 'touch',
      willChange: 'transform'
    };

    const totalColumnsWidth = this._columnSizeAndPositionManager.getTotalSize();
    const totalRowsHeight = this._rowSizeAndPositionManager.getTotalSize();

    // Force browser to hide scrollbars when we know they aren't necessary.
    // Otherwise once scrollbars appear they may not disappear again.
    // For more info see issue #116
    const verticalScrollBarSize = totalRowsHeight > height ? this._scrollbarSize : 0;
    const horizontalScrollBarSize = totalColumnsWidth > width ? this._scrollbarSize : 0;

    // Also explicitly init styles to 'auto' if scrollbars are required.
    // This works around an obscure edge case where external CSS styles have not yet been loaded,
    // But an initial scroll index of offset is set as an external prop.
    // Without this style, Grid would render the correct range of cells but would NOT update its internal offset.
    // This was originally reported via clauderic/react-infinite-calendar/issues/23
    gridStyle.overflowX = totalColumnsWidth + verticalScrollBarSize <= width ? 'hidden' : 'auto';
    gridStyle.overflowY = totalRowsHeight + horizontalScrollBarSize <= height ? 'hidden' : 'auto';

    const childrenToDisplay = this._childrenToDisplay;

    if (childrenToDisplay.length > 0) {
      return (
        <div
          className='ReactVirtualized__Grid__innerScrollContainer'
          style={{
            width: autoContainerWidth ? 'auto' : totalColumnsWidth,
            height: totalRowsHeight,
            maxWidth: totalColumnsWidth,
            maxHeight: totalRowsHeight,
            overflow: 'hidden',
            pointerEvents: isScrolling ? 'none' : '',
            ...containerStyle
          }}
        >
          {childrenToDisplay}
        </div>
      );
    }

    return (
      <div />
    );
  }
}

function VirtualTable(props) {
  return (
    <TableComponent
      overscanRowCount={50}
      cellRangeRenderer={cellRangeRenderer}
      {...props}
    />
  );
}

export default VirtualTable;
