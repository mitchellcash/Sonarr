import React, { Component, PropTypes } from 'react';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import EpisodeHistoryRow from './EpisodeHistoryRow';

const headers = [
  {
    name: 'eventType',
    label: ''
  },
  {
    name: 'sourceTitle',
    label: 'Source Title'
  },
  {
    name: 'quality',
    label: 'Quality'
  },
  {
    name: 'date',
    label: 'Date'
  },
  {
    name: 'details',
    label: 'Details'
  },
  {
    name: 'actions',
    label: 'Actions'
  }
];

class EpisodeHistory extends Component {

  //
  // Render

  render() {
    const {
      isFetching,
      isPopulated,
      error,
      items,
      onMarkAsFailedPress
    } = this.props;

    const hasItems = !!items.length;

    if (isFetching) {
      return (
        <LoadingIndicator />
      );
    }

    if (!isFetching && !!error) {
      return (
        <div>Unable to load episode history.</div>
      );
    }

    if (isPopulated && !hasItems && !error) {
      return (
        <div>No episode history.</div>
      );
    }

    if (isPopulated && hasItems && !error) {
      return (
        <Table
          headers={headers}
        >
          <TableBody>
            {
              items.map((item) => {
                return (
                  <EpisodeHistoryRow
                    key={item.id}
                    {...item}
                    onMarkAsFailedPress={onMarkAsFailedPress}
                  />
                );
              })
            }
          </TableBody>
        </Table>
      );
    }

    return null;
  }
}

EpisodeHistory.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isPopulated: PropTypes.bool.isRequired,
  error: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onMarkAsFailedPress: PropTypes.func.isRequired
};

EpisodeHistory.defaultProps = {
  selectedTab: 'details'
};

export default EpisodeHistory;
