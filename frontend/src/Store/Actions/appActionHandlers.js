import * as types from './actionTypes';
import { messengerTypes } from 'Helpers/Props';
import Messenger from 'Shared/Messenger';

const appActionHandlers = {
  [types.SHOW_MESSAGE]: function(payload) {
    return function(dispatch, getState) {
      const {
        id,
        type = messengerTypes.INFO,
        message,
        hideAfter = 0
      } = payload;

      Messenger.show({
        id,
        type,
        message,
        hideAfter
      });
    };
  }
};

export default appActionHandlers;
