import React, { PropTypes } from 'react';
import Icon from 'Components/Icon';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import styles from './SeriesStatusCell.css';

function SeriesStatusCell(monitored, status) {
  return (
    <TableRowCell className={styles.status}>
      <Icon
        className={styles.statusIcon}
        name={monitored ? 'icon-sonarr-monitored' : 'icon-sonarr-unmonitored'}
        title={monitored ? 'Series is monitored' : 'Series is unmonitored'}
      />

      <Icon
        className={styles.statusIcon}
        name={status === 'ended' ? 'icon-sonarr-series-ended' : 'icon-sonarr-series-continuing'}
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
