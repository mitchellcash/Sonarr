import React from 'react';
import PageContent from 'Components/Page/PageContent';
import styles from './NotFound.css';

function NotFound() {
  return (
    <PageContent title="MIA">
      <div className={styles.container}>
        <div className={styles.message}>
          You must be lost, nothing to see here.
        </div>

        <img
          className={styles.image}
          src={`${window.Sonarr.UrlBase}/Content/Images/404.png`}
        />
      </div>
    </PageContent>
  );
}

export default NotFound;
