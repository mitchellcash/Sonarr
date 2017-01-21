import React, { Component, PropTypes } from 'react';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import TaskRowConnector from './TaskRowConnector';

const headers = [
  {
    name: 'name',
    label: 'Name'
  },
  {
    name: 'interval',
    label: 'Interval'
  },
  {
    name: 'lastExecution',
    label: 'Last Execution'
  },
  {
    name: 'nextExecution',
    label: 'Next Execution'
  },
  {
    name: 'actions',
    label: ''
  }
];

class Tasks extends Component {

  //
  // Render

  render() {
    const {
      fetching,
      items
    } = this.props;

    return (
      <PageContent title="Tasks">
        <PageContentBody>
          {
            fetching &&
              <LoadingIndicator />
          }

          {
            !fetching &&
              <Table
                headers={headers}
              >
                <TableBody>
                  {
                    items.map((item) => {
                      return (
                        <TaskRowConnector
                          key={item.id}
                          {...item}
                        />
                      );
                    })
                  }
                </TableBody>
              </Table>
          }
        </PageContentBody>
      </PageContent>
    );
  }

}

Tasks.propTypes = {
  fetching: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired
};

export default Tasks;
