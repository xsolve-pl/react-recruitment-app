import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './../../components/Retro/Column.styles';
import Column from '../../components/Retro/Column';
import { columnEdit } from '../../actions/column';
import {
  CARD_ADD_QUERY_KEY,
  COLUMN_EDIT_QUERY_KEY,
  RETRO_CARDS_KEY,
  RETRO_FILTER_TERM,
  RETRO_HIDDEN_COLUMNS,
  RETRO_SORT_BY_VOTES
} from '../../reducers/retro';

import { RETRO_TOGGLE_COLUMN_HIDE } from '../../actions/retro';
import { cardAdd, cardEdit } from '../../actions/card';
import { addMessage } from '../../actions/layout';

const mapStateToProps = ({ retro }) => ({
  hiddenColumns: retro[RETRO_HIDDEN_COLUMNS],
  filterCardsBy: retro[RETRO_FILTER_TERM],
  sort: retro[RETRO_SORT_BY_VOTES],
  cards: retro[RETRO_CARDS_KEY],
  editColumnQuery: retro[COLUMN_EDIT_QUERY_KEY],
  addCardQuery: retro[CARD_ADD_QUERY_KEY]
});

const mapDispatchToProps = dispatch => ({
  hideColumn: name => dispatch({ type: RETRO_TOGGLE_COLUMN_HIDE, payload: name }),
  editCard: (socket, card) => dispatch(cardEdit(socket, card)),
  editColumn: (socket, column) => dispatch(columnEdit(socket, column)),
  addCard: (socket, columnId, text) => dispatch(cardAdd(socket, columnId, text)),
  addMessage: message => dispatch(addMessage(message))
});

export default withRouter(withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(Column)
));
