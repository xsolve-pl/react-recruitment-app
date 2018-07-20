import { withStyles } from 'material-ui/styles/index';
import { withMobileDialog } from 'material-ui/Dialog';
import { connect } from 'react-redux';

import styles from '../../components/GroupCardsDialog/GroupCardsDialog.styles';

import GroupCardsDialog from '../../components/GroupCardsDialog/GroupCardsDialog';
import { LAYOUT_GROUP_CARD_DIALOG_OPEN_KEY, LAYOUT_GROUP_CARD_DIALOG_CARD_TO_GROUP } from '../../reducers/layout';
import { cardRemove, cardEdit } from '../../actions/card';
import { openGroupCardDialog } from '../../actions/layout';


const mapStateToProps = state => ({
  cardToGroup: state.layout[LAYOUT_GROUP_CARD_DIALOG_CARD_TO_GROUP],
  open: state.layout[LAYOUT_GROUP_CARD_DIALOG_OPEN_KEY]
});

const mapDispatchToProps = dispatch => ({
  closeDialog: () => dispatch(openGroupCardDialog(false)),
  editCard: (socket, card) => dispatch(cardEdit(socket, card)),
  removeCard: (socket, cardId) => dispatch(cardRemove(socket, cardId))
});


export default withStyles(styles)(
  withMobileDialog({ breakpoint: 'xs' })(
    connect(mapStateToProps, mapDispatchToProps)(GroupCardsDialog)
  )
);
