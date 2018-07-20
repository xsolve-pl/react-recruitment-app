import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Typography } from 'material-ui';
import PlaylistAdd from 'material-ui-icons/PlaylistAdd';
import VisibilityOff from 'material-ui-icons/VisibilityOff';
import Visibility from 'material-ui-icons/Visibility';
import Card from '../../containers/Retro/Card';
import { QUERY_ERROR_KEY, queryFailed, QueryShape } from '../../services/websocket/query';

class Column extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  componentWillReceiveProps(nextProps) {
    const { addCardQuery, addMessage } = this.props;
    const { addCardQuery: nextAddCardQuery } = nextProps;
    if (queryFailed(addCardQuery, nextAddCardQuery)) {
      addMessage(nextAddCardQuery[QUERY_ERROR_KEY]);
    }
  }

  addCard = () => {
    const { socket } = this.context;
    const { text } = this.state;
    const { column: { id }, addCard } = this.props;

    addCard(socket, id, text);
    this.setState({ text: '' });
  };

  hideColumn = () => {
    const { column, hideColumn } = this.props;
    hideColumn(column.name);
  };

  handleTextChange = (e) => {
    this.setState({ text: e.target.value });
  };

  sortCards = (a, b) => b.votes.length - a.votes.length;

  handleDrop = (e) => {
    const { socket } = this.context;
    const { column: { id: currentColumnId }, editCard } = this.props;

    const { id, columnId } = JSON.parse(e.dataTransfer.getData('card'));

    if (columnId !== currentColumnId) {
      editCard(socket, { id, columnId: currentColumnId });
    }
  };

  render() {
    const { column, cards, classes, sort, filterCardsBy, hiddenColumns } = this.props;
    const columnCards = cards.filter(card => column.id === card.columnId);
    const cardsFilteredByTerm = filterCardsBy ?
      columnCards.filter(card => card.text.indexOf(filterCardsBy) > -1) :
      columnCards;
    const renderedCards = sort ? cardsFilteredByTerm.sort(this.sortCards) : cardsFilteredByTerm;
    return (
      <div
        className={classes.column}
        onDragOver={e => e.preventDefault()}
        onDrop={this.handleDrop}
      >
        <div className={classes.header}>
          <Typography
            type="headline"
            className={classes.columnTitle}
            onDoubleClick={this.startEditing}
          >{column.name}
          </Typography>
          <div>
            <IconButton className={classes.addCardIcon} onClick={this.addCard}>
              <PlaylistAdd className={classes.actionIcon} />
            </IconButton>
            {(!hiddenColumns[column.name] ||
            hiddenColumns[column.name] === undefined) &&
            <IconButton className={classes.addCardIcon} onClick={this.hideColumn}>
              <VisibilityOff className={classes.actionIcon} />
            </IconButton>}
            {
              hiddenColumns[column.name] &&
              <IconButton className={classes.addCardIcon} onClick={this.hideColumn}>
                <Visibility className={classes.actionIcon} />
              </IconButton>
            }
          </div>
        </div>
        {
          (
            !hiddenColumns[column.name] ||
            hiddenColumns[column.name] === undefined
          ) &&
          renderedCards.map(card => (
            <Card card={card} key={card.id} />
          ))}
      </div>
    );
  }
}

Column.contextTypes = {
  socket: PropTypes.object.isRequired
};

Column.propTypes = {
  // Values
  hiddenColumns: PropTypes.object.isRequired,
  filterCardsBy: PropTypes.string.isRequired,
  sort: PropTypes.bool.isRequired,
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  cards: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    columnId: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  })).isRequired,
  // Functions
  hideColumn: PropTypes.func.isRequired,
  editCard: PropTypes.func.isRequired,
  addCard: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  // Queries
  addCardQuery: PropTypes.shape(QueryShape).isRequired,
  // Styles
  classes: PropTypes.shape({
    column: PropTypes.string.isRequired,
    columnTitle: PropTypes.string.isRequired,
    addCardIcon: PropTypes.string.isRequired,
    addCardContainer: PropTypes.string.isRequired
  }).isRequired
};

export default Column;
