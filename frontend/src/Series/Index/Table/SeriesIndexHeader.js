import React from 'react';
import VirtualTableHeader from 'Components/Table/VirtualTableHeader';
import VirtualTableHeaderCell from 'Components/Table/VirtualTableHeaderCell';
import styles from './SeriesIndexHeader.css';

function SeriesIndexHeader(props) {
  return (
    <VirtualTableHeader>
      <VirtualTableHeaderCell
        className={styles.status}
        name="status"
        {...props}
      />

      <VirtualTableHeaderCell
        className={styles.title}
        name="sortTitle"
        sortable={true}
        {...props}
      >
        Title
      </VirtualTableHeaderCell>

      <VirtualTableHeaderCell
        className={styles.network}
        name="network"
        sortable={true}
        {...props}
      >
        Network
      </VirtualTableHeaderCell>

      <VirtualTableHeaderCell
        className={styles.qualityProfile}
        name="qualityProfileId"
        sortable={true}
        {...props}
      >
        Quality Profile
      </VirtualTableHeaderCell>

      <VirtualTableHeaderCell
        className={styles.relativeDate}
        name="nextAiring"
        sortable={true}
        {...props}
      >
        Next Airing
      </VirtualTableHeaderCell>

      <VirtualTableHeaderCell
        className={styles.seasonCount}
        name="seasonCount"
        sortable={true}
        {...props}
      >
        Seasons
      </VirtualTableHeaderCell>

      <VirtualTableHeaderCell
        className={styles.episodeProgress}
        name="episodeProgress"
        sortable={true}
        {...props}
      >
        Episodes
      </VirtualTableHeaderCell>

      <VirtualTableHeaderCell
        className={styles.actions}
        name="actions"
      >
        Actions
      </VirtualTableHeaderCell>
    </VirtualTableHeader>
  );
}

export default SeriesIndexHeader;
