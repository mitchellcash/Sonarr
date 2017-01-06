import React, { PropTypes } from 'react';
import { locationShape } from 'react-router';
import ImportSeriesSelectFolderConnector from './SelectFolder/ImportSeriesSelectFolderConnector';
import ImportSeriesConnector from './Import/ImportSeriesConnector';

function LogsPage({ locationShape }) {
  if (params && params.rootFolderId) {
    return (
      <ImportSeriesConnector
        rootFolderId={parseInt(params.rootFolderId)}
      />
    );
  }

  return (
    <ImportSeriesSelectFolderConnector />
  );
}

LogsPage.propTypes = {
  location: locationShape
};

export default LogsPage;
