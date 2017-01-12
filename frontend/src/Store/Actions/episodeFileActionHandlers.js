import createFetchHandler from './Creators/createFetchHandler';
import * as types from './actionTypes';

const episodeFileActionHandlers = {
  [types.FETCH_EPISODE_FILES]: createFetchHandler('episodeFiles', '/episodeFile')
};

export default episodeFileActionHandlers;
