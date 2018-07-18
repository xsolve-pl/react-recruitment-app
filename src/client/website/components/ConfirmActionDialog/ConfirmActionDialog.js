import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog, { DialogActions, DialogTitle } from 'material-ui/Dialog';
import { Button } from 'material-ui';
import { FormattedMessage } from 'react-intl';

class ConfirmActionDialog extends Component {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const {
      TriggeringComponent,
      textContent,
      onConfirm,
      cancelButtonText,
      confirmButtonText
    } = this.props;

    return (
      <div>
        <TriggeringComponent onClick={this.handleOpen} />
        <Dialog onClose={this.handleClose} open={this.state.open}>
          <DialogTitle>
            {textContent}
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              {cancelButtonText || <FormattedMessage id="navigation.cancel" />}
            </Button>
            <Button
              onClick={() => {
                onConfirm();
                this.handleClose();
              }}
              color="primary"
            >
              {confirmButtonText || <FormattedMessage id="navigation.ok" />}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ConfirmActionDialog.propTypes = {
  TriggeringComponent: PropTypes.func.isRequired,
  textContent: PropTypes.object.isRequired,
  onConfirm: PropTypes.func.isRequired,
  cancelButtonText: PropTypes.string,
  confirmButtonText: PropTypes.string
};

ConfirmActionDialog.defaultProps = {
  cancelButtonText: '',
  confirmButtonText: ''
};

export default ConfirmActionDialog;
