import React, { Component, PropTypes } from 'react';
import { locationShape } from 'react-router';
import PageHeader from './Header/PageHeader';
import PageSidebar from './Sidebar/PageSidebar';
import styles from './Page.css';

class Page extends Component {

  //
  // Render

  render() {
    const {
      className,
      location,
      children
    } = this.props;

    return (
      <div className={className}>
        <PageHeader />

        <div className={styles.main}>
          <PageSidebar
            location={location}
          />

          {children}
        </div>

      </div>
    );
  }
}

Page.propTypes = {
  className: PropTypes.string,
  location: locationShape.isRequired,
  children: PropTypes.node.isRequired
};

Page.defaultProps = {
  className: styles.page
};

export default Page;
