import React, { Component, PropTypes } from 'react';
import { icons } from 'Helpers/Props';
import IconButton from 'Components/IconButton';
import Link from 'Components/Link';
import SeriesSearchInputConnector from './SeriesSearchInputConnector';
import PageHeaderActionsMenuConnector from './PageHeaderActionsMenuConnector';
import styles from './PageHeader.css';

class PageHeader extends Component {

  //
  // Render

  render() {
    const {
      onSidebarToggle
    } = this.props;

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
}

PageHeader.propTypes = {
  onSidebarToggle: PropTypes.func.isRequired
};

export default PageHeader;
