import { createAction } from 'redux-actions';
import * as types from './actionTypes';

export const saveDimensions = createAction(types.SAVE_DIMENSIONS);

export const showMessage = createAction(types.SHOW_MESSAGE, (payload) => {
  return {
    section: 'messages',
    ...payload
  };
});

export const hideMessage = createAction(types.HIDE_MESSAGE, (payload) => {
  return {
    section: 'messages',
    ...payload
  };
});
