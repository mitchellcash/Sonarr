import React, { Component, PropTypes } from 'react';
import { icons } from 'Helpers/Props';
import IconButton from 'Components/IconButton';
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
          <img src="/Content/Images/logos/32.png" />
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
