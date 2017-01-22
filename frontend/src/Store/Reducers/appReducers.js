import { handleActions } from 'redux-actions';
import * as types from 'Store/Actions/actionTypes';
import createUpdateItemReducer from './Creators/createUpdateItemReducer';
import createRemoveItemReducer from './Creators/createRemoveItemReducer';

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
  dimensions: getDimensions(window.innerWidth, window.innerHeight),
  messages: {
    items: []
  }
};

const appReducers = handleActions({

  [types.SAVE_DIMENSIONS]: function(state, { payload }) {
    const {
      width,
      height
    } = payload;

    const dimensions = getDimensions(width, height);

    return Object.assign({}, state, { dimensions });
  },

  [types.SHOW_MESSAGE]: createUpdateItemReducer('messages'),
  [types.HIDE_MESSAGE]: createRemoveItemReducer('messages')

}, defaultState);

export default appReducers;
