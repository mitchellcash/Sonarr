import { createAction } from 'redux-actions';
import * as types from './actionTypes';
import appActionHandlers from './appActionHandlers';

export const initSignalR = appActionHandlers[types.INIT_SIGNALR];
export const showMessage = appActionHandlers[types.SHOW_MESSAGE];
export const saveDimensions = createAction(types.SAVE_DIMENSIONS);
