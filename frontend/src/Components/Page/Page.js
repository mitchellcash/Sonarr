import React, { Component, PropTypes } from 'react';
import { locationShape } from 'react-router';
import SignalRConnector from 'Components/SignalRConnector';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import AppUpdatedModalConnector from 'App/AppUpdatedModalConnector';
import PageHeader from './Header/PageHeader';
import PageSidebar from './Sidebar/PageSidebar';
import styles from './Page.css';

class Page extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isSidebarVisible: !props.isSmallScreen,
      isUpdatedModalOpen: false
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isUpdated && !this.props.isUpdated) {
      this.setState({ isUpdatedModalOpen: true });
    }
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

  onUpdatedModalClose = () => {
    this.setState({ isUpdatedModalOpen: false });
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

        <AppUpdatedModalConnector
          isOpen={this.state.isUpdatedModalOpen}
          onModalClose={this.onUpdatedModalClose}
        />
      </div>
    );
  }
}

Page.propTypes = {
  className: PropTypes.string,
  location: locationShape.isRequired,
  children: PropTypes.node.isRequired,
  isSmallScreen: PropTypes.bool.isRequired,
  isUpdated: PropTypes.bool.isRequired,
  onResize: PropTypes.func.isRequired
};

Page.defaultProps = {
  className: styles.page
};

export default Page;
