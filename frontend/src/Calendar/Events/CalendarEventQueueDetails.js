import moment from 'moment';
import React, { PropTypes } from 'react';
import { icons, kinds } from 'Helpers/Props';
import colors from 'Styles/Variables/colors';
import Icon from 'Components/Icon';
import CircularProgressBar from 'Components/CircularProgressBar';

function CalendarEventQueueDetails(props) {
  const {
    seriesType,
    seasonNumber,
    absoluteEpisodeNumber,
    title,
    size,
    sizeleft,
    estimatedCompletionTime,
    status,
    errorMessage
  } = props;

  const missingAbsoluteNumber = seriesType === 'anime' && seasonNumber > 0 && !absoluteEpisodeNumber;
  const progress = (100 - sizeleft / size * 100);

  if (status === 'pending') {
    return (
      <Icon
        name={icons.PENDING}
        title={`Release will be processed ${moment(estimatedCompletionTime).fromNow()}`}
      />
    );
  }

  if (status === 'completed') {
    if (errorMessage) {
      return (
        <Icon
          name={icons.DOWNLOAD}
          kind={kinds.DANGER}
          title={`Import failed: ${errorMessage}`}
        />
      );
    }

    // TODO: show an icon when download is complete, but not imported yet?
  }

  if (errorMessage) {
    return (
      <Icon
        name={icons.DOWNLOADING}
        kind={kinds.DANGER}
        title={`Download failed: ${errorMessage}`}
      />
    );
  }

  if (status === 'failed') {
    return (
      <Icon
        name={icons.DOWNLOADING}
        kind={kinds.DANGER}
        title="Download failed: check download client for more details"
      />
    );
  }

  if (status === 'warning') {
    return (
      <Icon
        name={icons.DOWNLOADING}
        kind={kinds.WARNING}
        title="Download warning: check download client for more details"
      />
    );
  }

  if (missingAbsoluteNumber) {
    return (
      <Icon
        name={icons.WARNING}
        title="Episode does not have an absolute episode number"
      />
    );
  }

  if (progress < 5) {
    return (
      <Icon
        name={icons.DOWNLOADING}
        title={`Episode is downloading - ${progress.toFixed(1)}% ${title}`}
      />
    );
  }

  return (
    <div title={`Episode is downloading - ${progress.toFixed(1)}% ${title}`}>
      <CircularProgressBar
        progress={progress}
        size={20}
        strokeWidth={2}
        strokeColor={colors.purple}
      />
    </div>
  );
}

CalendarEventQueueDetails.propTypes = {
  seriesType: PropTypes.string.isRequired,
  seasonNumber: PropTypes.number.isRequired,
  absoluteEpisodeNumber: PropTypes.number,
  title: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  sizeleft: PropTypes.number.isRequired,
  estimatedCompletionTime: PropTypes.string,
  status: PropTypes.string.isRequired,
  errorMessage: PropTypes.string
};

export default CalendarEventQueueDetails;
