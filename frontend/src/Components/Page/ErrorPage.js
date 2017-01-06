import React, { PropTypes } from 'react';
import getErrorMessage from 'Utilities/Object/getErrorMessage';
import styles from './ErrorPage.css';

function ErrorPage(props) {
  const {
    seriesError,
    tagsError,
    qualityProfilesError,
    uiSettingsError
  } = props;

  if (seriesError) {
    return (
      <div className={styles.page}>
        <div className={styles.errorMessage}>
          {getErrorMessage(seriesError, 'Failed to load series from API')}
        </div>
      </div>
    );
  }

  if (tagsError) {
    return (
      <div className={styles.page}>
        <div className={styles.errorMessage}>
          {getErrorMessage(tagsError, 'Failed to load tags from API')}
        </div>
      </div>
    );
  }

  if (qualityProfilesError) {
    return (
      <div className={styles.page}>
        <div className={styles.errorMessage}>
          {getErrorMessage(qualityProfilesError, 'Failed to load quality profiles from API')}
        </div>
      </div>
    );
  }

  if (uiSettingsError) {
    return (
      <div className={styles.page}>
        <div className={styles.errorMessage}>
          {getErrorMessage(uiSettingsError, 'Failed to load UI settings from API')}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.errorMessage}>
        Failed to load Sonarr
      </div>
    </div>
  );
}

ErrorPage.propTypes = {
  seriesError: PropTypes.object,
  tagsError: PropTypes.object,
  qualityProfilesError: PropTypes.object,
  uiSettingsError: PropTypes.object
};

export default ErrorPage;
