import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { fetchQueueStatus } from 'Store/Actions/queueActions';
import PageSidebarStatus from 'Components/Page/Sidebar/PageSidebarStatus';

function createMapStateToProps() {
  return createSelector(
    (state) => state.queue.queueStatus,
    (status) => {
      return {
        populated: status.populated,
        ...status.item
      };
    }
  );
}

const mapDispatchToProps = {
  fetchQueueStatus
};

class QueueStatusConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    if (!this.props.populated) {
      this.props.fetchQueueStatus();
    }
  }

  //
  // Render

  render() {
    return (
      <PageSidebarStatus
        {...this.props}
      />
    );
  }
}

QueueStatusConnector.propTypes = {
  populated: PropTypes.bool.isRequired,
  fetchQueueStatus: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(QueueStatusConnector);
