import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog, { DialogActions, DialogTitle } from 'material-ui/Dialog';
import { Button } from 'material-ui';
import { FormattedMessage } from 'react-intl';

class GroupCardsDialog extends Component {
  handleConfirmation = async () => {
    const { editCard, removeCard, closeDialog, cardToGroup: { from, to } } = this.props;
    const { socket } = this.context;
    const newText = `${from.text}\n\n${to.text}`;
    await editCard(socket, { id: to.id, text: newText });
    await removeCard(socket, from.id);
    closeDialog();
  };

  render() {
    const { closeDialog, open } = this.props;
    return (
      <Dialog onClose={closeDialog} open={open}>
        <DialogTitle>
          <FormattedMessage id="retro.group-cards" />
        </DialogTitle>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            <FormattedMessage id="navigation.cancel" />
          </Button>
          <Button onClick={this.handleConfirmation} color="primary">
            <FormattedMessage id="navigation.ok" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

GroupCardsDialog.contextTypes = {
  socket: PropTypes.object.isRequired
};

GroupCardsDialog.propTypes = {
  cardToGroup: PropTypes.shape({
    from: PropTypes.shape({
      id: PropTypes.string.isRequired,
      columnId: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    }),
    to: PropTypes.shape({
      id: PropTypes.string.isRequired,
      columnId: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })
  }).isRequired,
  closeDialog: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  editCard: PropTypes.func.isRequired,
  removeCard: PropTypes.func.isRequired
};

export default GroupCardsDialog;
