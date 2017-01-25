import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createAllSeriesSelector from 'Store/Selectors/createAllSeriesSelector';
import NotFound from 'Components/NotFound';
import SeriesDetailsConnector from './SeriesDetailsConnector';

function createMapStateToProps() {
  return createSelector(
    (state, { params }) => params,
    createAllSeriesSelector(),
    (params, allSeries) => {
      const titleSlug = params.titleSlug;
      const seriesIndex = _.findIndex(allSeries, { titleSlug });

      if (seriesIndex > -1) {
        return {
          titleSlug
        };
      }

      return {
      };
    }
  );
}

function SeriesDetailsPageConnector(props) {
  const {
    titleSlug
  } = props;

  if (!titleSlug) {
    return (
      <NotFound
        message="Sorry, that series cannot be found."
      />
    );
  }

  return (
    <SeriesDetailsConnector
      titleSlug={titleSlug}
    />
  );
}

SeriesDetailsPageConnector.propTypes = {
  titleSlug: PropTypes.string,
  params: PropTypes.shape({ titleSlug: PropTypes.string.isRequired }).isRequired
};

export default connect(createMapStateToProps)(SeriesDetailsPageConnector);
