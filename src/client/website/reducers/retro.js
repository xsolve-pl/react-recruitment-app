import deepClone from '../services/utils/deepClone';
import { handleQuery, QUERY_DEFAULT } from '../services/websocket/query';
import {
  RETRO_JOIN_FAILURE,
  RETRO_JOIN_IN_PROGRESS,
  RETRO_JOIN_SUCCESS,
  RETRO_LEAVE,
  RETRO_NEW_FAILURE,
  RETRO_NEW_IN_PROGRESS,
  RETRO_NEW_SUCCESS,
  RETRO_RECEIVED,
  RETRO_EDIT_FAILURE,
  RETRO_EDIT_IN_PROGRESS,
  RETRO_EDIT_SUCCESS,
  RETRO_TOGGLE_SORT,
  RETRO_TOGGLE_COLUMN_HIDE,
  RETRO_FILTER_CARDS
} from '../actions/retro';
import {
  COLUMN_ADD_FAILURE,
  COLUMN_ADD_IN_PROGRESS,
  COLUMN_ADD_SUCCESS,
  COLUMN_EDIT_FAILURE,
  COLUMN_EDIT_IN_PROGRESS,
  COLUMN_EDIT_SUCCESS,
  COLUMN_REMOVE_FAILURE,
  COLUMN_REMOVE_IN_PROGRESS,
  COLUMN_REMOVE_SUCCESS
} from '../actions/column';
import {
  CARD_ADD_FAILURE,
  CARD_ADD_IN_PROGRESS,
  CARD_ADD_SUCCESS,
  CARD_EDIT_FAILURE,
  CARD_EDIT_IN_PROGRESS,
  CARD_EDIT_SUCCESS,
  CARD_REMOVE_FAILURE,
  CARD_REMOVE_IN_PROGRESS,
  CARD_REMOVE_SUCCESS
} from '../actions/card';
import {
  STEPS_CHANGE_IN_PROGRESS,
  STEPS_CHANGE_SUCCESS,
  STEPS_CHANGE_FAILURE
} from '../actions/steps';
import {
  USER_SET_NAME_SUCCESS
} from '../actions/user';

// ------------------------------------
// State constants
// ------------------------------------
export const RETRO_ID_KEY = 'id';
export const RETRO_NAME_KEY = 'name';
export const RETRO_SHARE_ID_KEY = 'shareId';
export const RETRO_VOTE_LIMIT_KEY = 'voteLimit';
export const RETRO_USERS_KEY = 'users';
export const RETRO_STEP_KEY = 'step';
export const RETRO_SCRUM_MASTER_ID_KEY = 'scrumMasterId';
export const RETRO_COLUMNS_KEY = 'columns';
export const RETRO_CARDS_KEY = 'cards';
export const RETRO_NEW_QUERY_KEY = 'new';
export const RETRO_RENAME_QUERY_KEY = 'rename';
export const RETRO_JOIN_QUERY_KEY = 'join';
export const COLUMN_ADD_QUERY_KEY = 'addColumn';
export const COLUMN_REMOVE_QUERY_KEY = 'removeColumn';
export const COLUMN_EDIT_QUERY_KEY = 'editColumn';
export const CARD_ADD_QUERY_KEY = 'addCard';
export const CARD_REMOVE_QUERY_KEY = 'removeCard';
export const CARD_EDIT_QUERY_KEY = 'editCard';
export const CARD_VOTES_KEY = 'votes';
export const STEPS_CHANGE_QUERY_KEY = 'stepChange';
export const RETRO_SORT_BY_VOTES = 'sortByVotes';
export const RETRO_HIDDEN_COLUMNS = 'hiddenColumns';
export const RETRO_FILTER_TERM = 'searchTerm';

// ------------------------------------
// Reducer`
// ------------------------------------
const initialState = {
  [RETRO_FILTER_TERM]: '',
  [RETRO_HIDDEN_COLUMNS]: {},
  [RETRO_ID_KEY]: undefined,
  [RETRO_NAME_KEY]: undefined,
  [RETRO_SHARE_ID_KEY]: undefined,
  [RETRO_VOTE_LIMIT_KEY]: undefined,
  [RETRO_STEP_KEY]: undefined,
  [RETRO_USERS_KEY]: {},
  [RETRO_COLUMNS_KEY]: [],
  [RETRO_CARDS_KEY]: [],
  [RETRO_NEW_QUERY_KEY]: QUERY_DEFAULT(),
  [RETRO_RENAME_QUERY_KEY]: QUERY_DEFAULT(),
  [RETRO_JOIN_QUERY_KEY]: QUERY_DEFAULT(),
  [COLUMN_ADD_QUERY_KEY]: QUERY_DEFAULT(),
  [COLUMN_REMOVE_QUERY_KEY]: QUERY_DEFAULT(),
  [COLUMN_EDIT_QUERY_KEY]: QUERY_DEFAULT(),
  [CARD_ADD_QUERY_KEY]: QUERY_DEFAULT(),
  [CARD_REMOVE_QUERY_KEY]: QUERY_DEFAULT(),
  [CARD_EDIT_QUERY_KEY]: QUERY_DEFAULT(),
  [STEPS_CHANGE_QUERY_KEY]: QUERY_DEFAULT(),
  [RETRO_SORT_BY_VOTES]: false
};

const ACTION_HANDLERS = {
  [RETRO_FILTER_CARDS]: (state, { searchTerm }) => {
    const newState = deepClone(state);
    newState[RETRO_FILTER_TERM] = searchTerm;
    return newState;
  },
  [RETRO_TOGGLE_COLUMN_HIDE]: (state, { payload }) => {
    const newState = deepClone(state);
    if (!newState[RETRO_HIDDEN_COLUMNS][payload]) {
      newState[RETRO_HIDDEN_COLUMNS][payload] = true;
    } else {
      newState[RETRO_HIDDEN_COLUMNS][payload] = !newState[RETRO_HIDDEN_COLUMNS][payload];
    }
    return newState;
  },
  [RETRO_TOGGLE_SORT]: (state) => {
    const newState = deepClone(state);
    newState[RETRO_SORT_BY_VOTES] = !newState[RETRO_SORT_BY_VOTES];
    return newState;
  },
  ...handleQuery([
    RETRO_JOIN_IN_PROGRESS,
    {
      [RETRO_JOIN_SUCCESS](state, payload) {
        const newState = deepClone(state);
        const { userJoined: { id, name } } = payload;
        newState[RETRO_USERS_KEY][id] = { id, name };
        return newState;
      }
    },
    RETRO_JOIN_FAILURE
  ], RETRO_JOIN_QUERY_KEY),
  [RETRO_RECEIVED]: (state, { payload }) => {
    const newState = deepClone(state);
    const { id, name, voteLimit, shareId, step, scrumMaster, users, columns, cards } = payload;

    newState[RETRO_ID_KEY] = id;
    newState[RETRO_NAME_KEY] = name;
    newState[RETRO_STEP_KEY] = step;
    newState[RETRO_SHARE_ID_KEY] = shareId;
    newState[RETRO_VOTE_LIMIT_KEY] = voteLimit;

    const usersObject = {};
    Object.values(users).forEach((user) => {
      usersObject[user.user.id] = user.user;
    });
    newState[RETRO_USERS_KEY] = usersObject;
    newState[RETRO_SCRUM_MASTER_ID_KEY] = scrumMaster;
    newState[RETRO_COLUMNS_KEY] = columns;
    newState[RETRO_CARDS_KEY] = cards;

    return newState;
  },
  [RETRO_LEAVE]: (state, { payload }) => {
    const newState = deepClone(state);
    const { userLeft: { id } } = payload;

    const usersArray = Object.values(newState[RETRO_USERS_KEY])
      .filter(user => user.id !== id);

    const usersObject = {};
    usersArray.forEach((user) => {
      usersObject[user.id] = user;
    });

    newState[RETRO_USERS_KEY] = usersObject;

    return newState;
  },
  ...handleQuery([
    RETRO_NEW_IN_PROGRESS,
    RETRO_NEW_SUCCESS,
    RETRO_NEW_FAILURE
  ], RETRO_NEW_QUERY_KEY),
  ...handleQuery([
    RETRO_EDIT_IN_PROGRESS,
    {
      [RETRO_EDIT_SUCCESS](state, payload) {
        const newState = deepClone(state);
        const { name, voteLimit } = payload;

        newState[RETRO_NAME_KEY] = name;
        newState[RETRO_VOTE_LIMIT_KEY] = voteLimit;

        return newState;
      }
    },
    RETRO_EDIT_FAILURE
  ], RETRO_RENAME_QUERY_KEY),
  ...handleQuery([
    COLUMN_ADD_IN_PROGRESS,
    {
      [COLUMN_ADD_SUCCESS](state, payload) {
        const newState = deepClone(state);
        newState[RETRO_COLUMNS_KEY].push(payload);

        return newState;
      }
    },
    COLUMN_ADD_FAILURE
  ], COLUMN_ADD_QUERY_KEY),
  ...handleQuery([
    COLUMN_REMOVE_IN_PROGRESS,
    {
      [COLUMN_REMOVE_SUCCESS](state, payload) {
        const newState = deepClone(state);
        const { id } = payload;
        const indexToRemove = newState[RETRO_COLUMNS_KEY]
          .findIndex(column => column.id === id);

        newState[RETRO_COLUMNS_KEY].splice(indexToRemove, 1);

        return newState;
      }
    },
    COLUMN_REMOVE_FAILURE
  ], COLUMN_REMOVE_QUERY_KEY),
  ...handleQuery([
    COLUMN_EDIT_IN_PROGRESS,
    {
      [COLUMN_EDIT_SUCCESS](state, payload) {
        const newState = deepClone(state);
        const { id } = payload;
        const indexToUpdate = newState[RETRO_COLUMNS_KEY]
          .find(column => column.id === id);

        newState[RETRO_COLUMNS_KEY][indexToUpdate] = payload;

        return newState;
      }
    },
    COLUMN_EDIT_FAILURE
  ], COLUMN_EDIT_QUERY_KEY),
  ...handleQuery([
    CARD_ADD_IN_PROGRESS,
    {
      [CARD_ADD_SUCCESS](state, payload) {
        const newState = deepClone(state);
        const newCard = payload;

        newState[RETRO_CARDS_KEY]
          .filter(card => card.new)
          .map((card) => {
            const oldCard = card;
            return delete oldCard.new && oldCard;
          });
        newState[RETRO_CARDS_KEY].unshift(newCard);
        return newState;
      }
    },
    CARD_ADD_FAILURE
  ], CARD_ADD_QUERY_KEY),
  ...handleQuery([
    CARD_REMOVE_IN_PROGRESS,
    {
      [CARD_REMOVE_SUCCESS](state, payload) {
        const newState = deepClone(state);
        const { id } = payload;
        const indexToRemove = newState[RETRO_CARDS_KEY]
          .findIndex(column => column.id === id);

        newState[RETRO_CARDS_KEY].splice(indexToRemove, 1);

        return newState;
      }
    },
    CARD_REMOVE_FAILURE
  ], CARD_REMOVE_QUERY_KEY),
  ...handleQuery([
    CARD_EDIT_IN_PROGRESS,
    {
      [CARD_EDIT_SUCCESS](state, payload) {
        const newState = deepClone(state);
        const editCard = payload;
        const cardToUpdate = newState[RETRO_CARDS_KEY]
          .find(column => column.id === editCard.id);

        if (cardToUpdate) {
          delete editCard.new;
          Object.assign(cardToUpdate, editCard);
        }

        return newState;
      }
    },
    CARD_EDIT_FAILURE
  ], CARD_EDIT_QUERY_KEY),
  ...handleQuery([
    STEPS_CHANGE_IN_PROGRESS,
    {
      [STEPS_CHANGE_SUCCESS](state, payload) {
        const newState = deepClone(state);
        const { step } = payload;
        newState[RETRO_STEP_KEY] = step;
        return newState;
      }
    },
    STEPS_CHANGE_FAILURE
  ], STEPS_CHANGE_QUERY_KEY),
  [USER_SET_NAME_SUCCESS]: (state, { payload }) => {
    const newState = deepClone(state);
    const { id, name } = payload;
    newState[RETRO_USERS_KEY][id] = payload;
    newState[RETRO_CARDS_KEY] = newState[RETRO_CARDS_KEY].map(card => ({
      ...card,
      authors: card.authors
        .map((author) => {
          if (author.id === id) {
            return { ...author, id, name };
          }
          return author;
        })
    }));
    return newState;
  }
};

export const retroReducer = (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};

export default retroReducer;
