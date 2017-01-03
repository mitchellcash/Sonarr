import { createSelector } from 'reselect';
import connectSection from 'Store/connectSection';
import createClientSideCollectionSelector from 'Store/Selectors/createClientSideCollectionSelector';
import createUISettingsSelector from 'Store/Selectors/createUISettingsSelector';
import SeriesIndexPosters from './SeriesIndexPosters';

function createMapStateToProps() {
  return createSelector(
    createClientSideCollectionSelector(),
    createUISettingsSelector(),
    (series, uiSettings) => {
      return {
        showRelativeDates: uiSettings.showRelativeDates,
        shortDateFormat: uiSettings.shortDateFormat,
        timeFormat: uiSettings.timeFormat,
        ...series

      };
    }
  );
}

export default connectSection(
                createMapStateToProps,
                undefined,
                undefined,
                undefined,
                { section: 'series', uiSection: 'seriesIndex' }
              )(SeriesIndexPosters);
