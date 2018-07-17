export const LAYOUT_OPEN_CHANGE_NAME_DIALOG = 'LAYOUT_OPEN_CHANGE_NAME_DIALOG';
export const LAYOUT_ADD_MESSAGE = 'LAYOUT_ADD_MESSAGE';
export const LAYOUT_REMOVE_MESSAGE = 'LAYOUT_REMOVE_MESSAGE';
export const LAYOUT_SET_LOCALE = 'LAYOUT_SET_LOCALE';
export const LAYOUT_OPEN_GROUP_CARD_DIALOG = 'LAYOUT_OPEN_GROUP_CARD_DIALOG';

export const openGroupCardDialog = (open, cardData = {}) => ({
  type: LAYOUT_OPEN_GROUP_CARD_DIALOG,
  payload: { open, cardData }
});

export const openChangeNameDialog = open => ({
  type: LAYOUT_OPEN_CHANGE_NAME_DIALOG,
  payload: open
});

export const addMessage = message => ({
  type: LAYOUT_ADD_MESSAGE,
  payload: message
});

export const removeMessage = id => ({
  type: LAYOUT_REMOVE_MESSAGE,
  payload: id
});

export const setLocale = locale => ({
  type: LAYOUT_SET_LOCALE,
  payload: locale
});
