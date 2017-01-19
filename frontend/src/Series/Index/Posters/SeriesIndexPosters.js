import React, { Component, PropTypes } from 'react';
import { forceCheck } from 'react-lazyload';
import { sortDirections } from 'Helpers/Props';
import SeriesIndexItemConnector from 'Series/Index/SeriesIndexItemConnector';
import SeriesIndexPoster from './SeriesIndexPoster';
import styles from './SeriesIndexPosters.css';

class SeriesIndexPosters extends Component {

  //
  // Lifecycle

  componentDidUpdate(prevProps) {
    const {
      filterKey,
      filterValue,
      sortKey,
      sortDirection
    } = this.props;

    if (prevProps.filterKey !== filterKey ||
        prevProps.filterValue !== filterValue ||
        prevProps.sortKey !== sortKey ||
        prevProps.sortDirection !== sortDirection) {
      forceCheck();
    }
  }

  //
  // Render

  render() {
    const {
      items,
      showRelativeDates,
      shortDateFormat,
      timeFormat
    } = this.props;

    return (
      <div className={styles.posters}>
        {
          items.map((item) => {
            return (
              <SeriesIndexItemConnector
                key={item.id}
                component={SeriesIndexPoster}
                showRelativeDates={showRelativeDates}
                shortDateFormat={shortDateFormat}
                timeFormat={timeFormat}
                {...item}
              />
            );
          })
        }
      </div>
    );
  }
}

SeriesIndexPosters.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterKey: PropTypes.string,
  filterValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
  sortKey: PropTypes.string,
  sortDirection: PropTypes.oneOf(sortDirections.all),
  showRelativeDates: PropTypes.bool.isRequired,
  shortDateFormat: PropTypes.string.isRequired,
  timeFormat: PropTypes.string.isRequired
};

export default SeriesIndexPosters;
