import React, { PropTypes } from 'react';
import { icons } from 'Helpers/Props';
import Icon from 'Components/Icon';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import styles from './SeriesStatusCell.css';

function SeriesStatusCell(props) {
  const {
    monitored,
    status,
    component: Component,
    ...otherProps
  } = props;

  return (
    <Component
      className={styles.status}
      {...otherProps}
    >
      <Icon
        className={styles.statusIcon}
        name={monitored ? icons.MONITORED : icons.UNMONITORED}
        title={monitored ? 'Series is monitored' : 'Series is unmonitored'}
      />

      <Icon
        className={styles.statusIcon}
        name={status === 'ended' ? icons.SERIES_ENDED : icons.SERIES_CONTINUING}
        title={status === 'ended' ? 'Ended' : 'Continuing'}

      />
    </Component>
  );
}

SeriesStatusCell.propTypes = {
  monitored: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  component: PropTypes.func
};

SeriesStatusCell.defaultProps = {
  component: TableRowCell
};

export default SeriesStatusCell;
