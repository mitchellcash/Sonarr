import _ from 'lodash';
import React, { PropTypes } from 'react';
import { scrollDirections } from 'Helpers/Props';
import Scroller from 'Components/Scroller';
import TableHeader from './TableHeader';
import TableHeaderCell from './TableHeaderCell';
import TableSelectAllHeaderCell from './TableSelectAllHeaderCell';
import styles from './Table.css';

const tableHeaderCellProps = [
  'sortKey',
  'sortDirection'
];

function getTableHeaderCellProps(props) {
  return _.reduce(tableHeaderCellProps, (result, key) => {
    if (props.hasOwnProperty(key)) {
      result[key] = props[key];
    }

    return result;
  }, {});
}

function Table(props) {
  const {
    className,
    selectAll,
    headers,
    children,
    onSortPress,
    ...otherProps
  } = props;

  return (
    <Scroller
      className={styles.tableContainer}
      scrollDirection={scrollDirections.HORIZONTAL}
    >
      <table className={className}>
        <TableHeader>
          {
            selectAll &&
              <TableSelectAllHeaderCell {...otherProps} />
          }

          {
            headers.map((header) => {
              return (
                <TableHeaderCell
                  key={header.name}
                  onSortPress={onSortPress}
                  {...getTableHeaderCellProps(otherProps)}
                  {...header}
                >
                  {header.label}
                </TableHeaderCell>
              );
            })
          }
        </TableHeader>
        {children}
      </table>
    </Scroller>
  );
}

Table.propTypes = {
  className: PropTypes.string,
  selectAll: PropTypes.bool.isRequired,
  headers: PropTypes.array,
  children: PropTypes.node,
  onSortPress: PropTypes.func
};

Table.defaultProps = {
  className: styles.table,
  selectAll: false
};

export default Table;
