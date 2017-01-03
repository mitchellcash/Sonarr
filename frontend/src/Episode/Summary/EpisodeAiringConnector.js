import _ from 'lodash';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createUiSettingsSelector from 'Store/Selectors/createUiSettingsSelector';
import EpisodeAiring from './EpisodeAiring';

function createMapStateToProps() {
  return createSelector(
    createUiSettingsSelector(),
    (uiSettings) => {
      return _.pick(uiSettings, [
        'shortDateFormat',
        'showRelativeDates',
        'timeFormat'
      ]);
    }
  );
}

export default connect(createMapStateToProps)(EpisodeAiring);
