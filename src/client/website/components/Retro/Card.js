import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Card as MaterialCard,
  CardActions,
  CardContent,
  IconButton,
  Button,
  TextField,
  Typography
} from 'material-ui';
import Done from 'material-ui-icons/Done';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import { FormattedMessage } from 'react-intl';
import onClickOutside from 'react-onclickoutside';
import {
  QUERY_ERROR_KEY,
  queryFailed,
  QueryShape
} from '../../services/websocket/query';
import ConfirmActionDialog from '../../containers/ConfirmActionDialog';
import Votes from '../../components/Votes';

class Card extends Component {
  constructor(props) {
    super(props);
    const { card } = props;
    this.state = { isEditing: false, text: card.text };
    this.addVote = this.vote.bind(this, true);
    this.removeVote = this.vote.bind(this, false);
  }

  componentDidMount() {
    const { card, userId } = this.props;
    const isAuthor = card.authors.find(({ id }) => id === userId) !== undefined;
    return (card.new && card.authors.length === 1 && isAuthor)
      && this.startEditing();
  }

  componentWillReceiveProps(nextProps) {
    const { editCardQuery, removeCardQuery, addMessage } = this.props;
    const { editCardQuery: nextEditCardQuery, removeCardQuery: nextRemoveCardQuery } = nextProps;

    if (queryFailed(editCardQuery, nextEditCardQuery)) {
      addMessage(nextEditCardQuery[QUERY_ERROR_KEY]);
    }

    if (queryFailed(removeCardQuery, nextRemoveCardQuery)) {
      addMessage(nextRemoveCardQuery[QUERY_ERROR_KEY]);
    }
  }

  vote(vote = true) {
    const { socket } = this.context;
    const { editCard, card: { id }, userId } = this.props;

    editCard(socket, { id, addVote: vote && userId, removeVote: !vote && userId });
  }

  handleTextChange = (e) => {
    this.setState({ text: e.target.value });
  };

  startEditing = () => {
    const { card, card: { text }, userId, retroStep } = this.props;
    if ((retroStep === 'write' || retroStep === 'closed') && card.authors.find(({ id }) => id === userId)) {
      this.setState({ isEditing: true, text });
    }
  };

  editCard = () => {
    const { socket } = this.context;
    const { text } = this.state;
    const { editCard, card: { id } } = this.props;
    if (text.replace(/^\s+|\s+$/g, '').length !== 0) {
      editCard(socket, { id, text });
      this.setState({ isEditing: false });
    }
  };

  handleClickOutside = () => {
    const { isEditing, text } = this.state;
    const { card, removeCard } = this.props;
    const { socket } = this.context;
    if (isEditing && card.new && text.replace(/^\s+|\s+$/g, '').length === 0) {
      removeCard(socket, card.id);
    }
  };

  handleDrop = (ev) => {
    const { card, openGroupCardDialog } = this.props;
    ev.stopPropagation();
    const from = JSON.parse(ev.dataTransfer.getData('card'));
    if (from.id !== card.id) openGroupCardDialog({ from, to: card });
  };

  handelDragStart = (ev) => {
    const { card } = this.props;
    const cardData = JSON.stringify(card);
    ev.dataTransfer.setData('card', cardData);
  };

  render() {
    const { userId, votes, userSubmmitedVotes, card, classes, removeCard, retroStep } = this.props;
    const { isEditing, text } = this.state;
    const { socket } = this.context;
    return (
      <div
        draggable={!isEditing}
        onDragStart={this.handelDragStart}
        onDragOver={e => e.preventDefault()}
        onDrop={this.handleDrop}
      >
        <MaterialCard className={classes.card}>
          <CardContent key="content">
            {isEditing ? (
              <TextField
                multiline
                autoFocus
                margin="dense"
                onChange={this.handleTextChange}
                label={<FormattedMessage id="retro.add-card-label" />}
                fullWidth
                value={text}
              />
            ) : (
              <Typography align="left" className={classes.text} onDoubleClick={this.startEditing}>
                {card.text}
              </Typography>
            )}
          </CardContent>
          <CardActions key="actions" className={classes.cardActions}>
            {(!isEditing) && card.authors.map(({ id, name }) => (
              <Button key={id} size="small" className={classes.author}>{name}</Button>
            ))}
            <div className={classes.expander} />
            {isEditing &&
            <IconButton key="done" className={classes.action} onClick={this.editCard}>
              <Done className={classes.doneIcon} />
            </IconButton>
            }
            {(!isEditing && (retroStep === 'write' || retroStep === 'closed')
              && card.authors.find(({ id }) => id === userId)) && [
                <IconButton key="edit" className={classes.action} onClick={this.startEditing}>
                  <EditIcon className={classes.editIcon} />
                </IconButton>,
                <ConfirmActionDialog
                  key="delete-confirm"
                  TriggeringComponent={({ onClick }) => (
                    <IconButton
                      key="delete"
                      className={classes.action}
                    >
                      <DeleteIcon className={classes.delIcon} onClick={onClick} />
                    </IconButton>
                  )
                  }
                  textContent={<FormattedMessage id="retro.confirm-delete-card" />}
                  onConfirm={() => removeCard(socket, card.id)}
                />
              ]}
          </CardActions>
          {retroStep === 'vote' &&
          <Votes
            key="votes"
            disabled={votes - userSubmmitedVotes <= 0}
            totalVotesNr={card.votes.length}
            userVotesNr={card.votes.filter(v => v === userId).length}
            addUserVote={this.addVote}
            removeUserVote={this.removeVote}
          />}
        </MaterialCard>
      </div>
    );
  }
}

Card.contextTypes = {
  socket: PropTypes.object.isRequired
};

Card.propTypes = {
  // Values
  userId: PropTypes.string.isRequired,
  userSubmmitedVotes: PropTypes.number.isRequired,
  votes: PropTypes.number.isRequired,
  retroStep: PropTypes.string.isRequired,
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    new: PropTypes.bool,
    authors: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired,
  // Functions
  openGroupCardDialog: PropTypes.func.isRequired,
  editCard: PropTypes.func.isRequired,
  removeCard: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  // Queries
  removeCardQuery: PropTypes.shape(QueryShape).isRequired,
  editCardQuery: PropTypes.shape(QueryShape).isRequired,
  // Styles
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    text: PropTypes.string,
    cardActions: PropTypes.string.isRequired,
    expander: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    actionIcon: PropTypes.string.isRequired,
    doneIcon: PropTypes.string.isRequired
  }).isRequired
};

export default onClickOutside(Card);
