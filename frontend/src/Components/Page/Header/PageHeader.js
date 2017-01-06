import React, { Component, PropTypes } from 'react';
import styles from './PageHeader.css';

class PageHeader extends Component {

  //
  // Render

  render() {
    return (
      <div className={styles.header}>
        Header
      </div>
    );
  }
}

PageHeader.propTypes = {
};

export default PageHeader;
