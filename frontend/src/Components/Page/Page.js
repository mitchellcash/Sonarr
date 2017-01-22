import React, { Component, PropTypes } from 'react';
import { locationShape } from 'react-router';
import SignalRConnector from 'Components/SignalRConnector';
import PageHeader from './Header/PageHeader';
import PageSidebar from './Sidebar/PageSidebar';
import styles from './Page.css';

class Page extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isSidebarVisible: !props.isSmallScreen
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  //
  // Listeners

  onResize = () => {
    this.props.onResize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  onSidebarToggle = () => {
    this.setState({ isSidebarVisible: !this.state.isSidebarVisible });
  }

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
        <SignalRConnector />

        <PageHeader
          onSidebarToggle={this.onSidebarToggle}
        />

        <div className={styles.main}>
          <PageSidebar
            location={location}
            isSidebarVisible={this.state.isSidebarVisible}
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
  children: PropTypes.node.isRequired,
  isSmallScreen: PropTypes.bool.isRequired,
  onResize: PropTypes.func.isRequired
};

Page.defaultProps = {
  className: styles.page
};

export default Page;
