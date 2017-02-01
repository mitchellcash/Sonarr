import React, { PropTypes } from 'react';
import styles from './VirtualTableRowCell.css';

function VirtualTableRowCell(props) {
  const {
    className,
    children,
    style
  } = props;

  return (
    <div
      className={className}
      style={style}
    >
      {children}
    </div>
  );
}

VirtualTableRowCell.propTypes = {
  className: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

VirtualTableRowCell.defaultProps = {
  className: styles.cell
};

export default VirtualTableRowCell;
