import React, { PropTypes } from 'react';
import { icons } from 'Helpers/Props';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import SeriesSearchInputConnector from './SeriesSearchInputConnector';
import PageHeaderActionsMenuConnector from './PageHeaderActionsMenuConnector';
import styles from './PageHeader.css';

function PageHeader(props) {
  const {
    onSidebarToggle
  } = props;

  return (
    <div className={styles.header}>
      <div className={styles.logoContainer}>
        <Link to={`${window.Sonarr.UrlBase}/`}>
          <img src={`${window.Sonarr.UrlBase}/Content/Images/logos/32.png`} />
        </Link>
      </div>

      <div className={styles.sidebarToggleContainer}>
        <IconButton
          name={icons.NAVBAR_COLLAPSE}
          onPress={onSidebarToggle}
        />
      </div>

      <SeriesSearchInputConnector />

      <PageHeaderActionsMenuConnector />
    </div>
  );
}

PageHeader.propTypes = {
  onSidebarToggle: PropTypes.func.isRequired
};

export default PageHeader;
