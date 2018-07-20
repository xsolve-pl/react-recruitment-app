import { push } from 'react-router-redux';
import qs from 'query-string';

export const ACTION_RETRO = 'retro/success';
export const RETRO_RECEIVED = 'RETRO_RECEIVED';

export const ACTION_RETRO_NEW = 'retro/new';
export const RETRO_NEW_IN_PROGRESS = 'RETRO_NEW_IN_PROGRESS';
export const RETRO_NEW_SUCCESS = 'RETRO_NEW_SUCCESS';
export const RETRO_NEW_FAILURE = 'RETRO_NEW_FAILURE';

export const ACTION_RETRO_JOIN = 'retro/join';
export const RETRO_JOIN_IN_PROGRESS = 'RETRO_JOIN_IN_PROGRESS';
export const RETRO_JOIN_SUCCESS = 'RETRO_JOIN_SUCCESS';
export const RETRO_JOIN_FAILURE = 'RETRO_JOIN_FAILURE';

export const ACTION_RETRO_LEAVE = 'retro/leave/success';
export const RETRO_LEAVE = 'RETRO_LEAVE';

export const ACTION_RETRO_EDIT = 'retro/edit';
export const RETRO_EDIT_IN_PROGRESS = 'RETRO_EDIT_IN_PROGRESS';
export const RETRO_EDIT_SUCCESS = 'RETRO_EDIT_SUCCESS';
export const RETRO_EDIT_FAILURE = 'RETRO_EDIT_FAILURE';

export const RETRO_TOGGLE_SORT = 'RETRO_TOGGLE_SORT';
export const RETRO_TOGGLE_COLUMN_HIDE = 'RETRO_TOGGLE_COLUMN_HIDE';
export const RETRO_FILTER_CARDS = 'RETRO_FILTER_CARDS';

export const setRetroIdQueryParameter = retroId => (dispatch) => {
  const query = { r: retroId };
  const searchString = qs.stringify(query);

  dispatch(push({
    search: searchString
  }));
};

export const retroCreate = (socket, name) => (dispatch) => {
  socket.emit(ACTION_RETRO_NEW, { name });
  dispatch({ type: RETRO_NEW_IN_PROGRESS });
};

export const retroJoin = (socket, shareId) => (dispatch) => {
  socket.emit(ACTION_RETRO_JOIN, { id: shareId });
  dispatch({ type: RETRO_JOIN_IN_PROGRESS });
};
export const retroLeave = (socket, shareId) => (dispatch) => {
  socket.emit(RETRO_LEAVE, { id: shareId });
  dispatch({ type: RETRO_LEAVE });
};

export const retroEdit = (socket, edits) => (dispatch) => {
  socket.emit(ACTION_RETRO_EDIT, edits);
  dispatch({ type: RETRO_EDIT_IN_PROGRESS });
};
