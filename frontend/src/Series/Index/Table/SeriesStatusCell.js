import React, { PropTypes } from 'react';
import { icons } from 'Helpers/Props';
import Icon from 'Components/Icon';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import styles from './SeriesStatusCell.css';

function SeriesStatusCell(monitored, status) {
  return (
    <TableRowCell className={styles.status}>
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
    </TableRowCell>
  );
}

SeriesStatusCell.propTypes = {
  monitored: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired
};

export default SeriesStatusCell;
