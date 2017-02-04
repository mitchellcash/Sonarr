import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Measure from 'react-measure';
import { WindowScroller } from 'react-virtualized';
import { scrollDirections } from 'Helpers/Props';
import Scroller from 'Components/Scroller';
import VirtualTableBody from './VirtualTableBody';
import styles from './VirtualTable.css';

class VirtualTable extends Component {

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

  setTableRef = (ref) => {
    this._table = ref;
  }

  forceUpdateGrid = () => {
    this._table.recomputeGridSize();
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
      isSmallScreen,
      header,
      headerHeight,
      rowRenderer,
      ...otherProps
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
                {header}

                <VirtualTableBody
                  ref={this.setTableRef}
                  autoContainerWidth={true}
                  width={width}
                  height={height}
                  headerHeight={height - headerHeight}
                  rowHeight={38}
                  rowCount={items.length}
                  columnCount={1}
                  scrollTop={scrollTop}
                  autoHeight={true}
                  overscanRowCount={2}
                  cellRenderer={rowRenderer}
                  columnWidth={width}
                  {...otherProps}
                />
              </Scroller>
              );
          }
        }
        </WindowScroller>
      </Measure>
    );
  }
}

VirtualTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  contentBody: PropTypes.object.isRequired,
  isSmallScreen: PropTypes.bool.isRequired,
  header: PropTypes.node.isRequired,
  headerHeight: PropTypes.number.isRequired,
  rowRenderer: PropTypes.func.isRequired
};

VirtualTable.defaultProps = {
  headerHeight: 38
};

export default VirtualTable;
