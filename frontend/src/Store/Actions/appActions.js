import { createAction } from 'redux-actions';
import * as types from './actionTypes';
import appActionHandlers from './appActionHandlers';

export const showMessage = appActionHandlers[types.SHOW_MESSAGE];
export const saveDimensions = createAction(types.SAVE_DIMENSIONS);
