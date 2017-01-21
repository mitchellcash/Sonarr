import { handleActions } from 'redux-actions';
import * as types from 'Store/Actions/actionTypes';

function getDimensions(width, height) {
  const dimensions = {
    width,
    height,
    isExtraSmallScreen: width <= 480,
    isSmallScreen: width <= 768,
    isMediumScreen: width <= 992,
    isLargeScreen: width <= 1200
  };

  return dimensions;
}

export const defaultState = {
  dimensions: getDimensions(window.innerWidth, window.innerHeight)
};

const appReducers = handleActions({

  [types.SAVE_DIMENSIONS]: function(state, { payload }) {
    const {
      width,
      height
    } = payload;

    const dimensions = getDimensions(width, height);

    return Object.assign({}, state, { dimensions });
  }

}, defaultState);

export default appReducers;
