import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router-dom';
import styles from './../../components/Retro/ControlPanel.styles';
import {
  RETRO_HIDDEN_COLUMNS,
  RETRO_SORT_BY_VOTES
} from '../../reducers/retro';
import {
  RETRO_TOGGLE_SORT,
  RETRO_FILTER_CARDS
} from '../../actions/retro';
import ControlPanel from '../../components/Retro/ControlPanel';

const mapStateToProps = ({ retro }) => ({
  sort: retro[RETRO_SORT_BY_VOTES],
  hiddenColumns: retro[RETRO_HIDDEN_COLUMNS]
});

const mapDispatchToProps = dispatch => ({
  filterCardsBy: searchTerm => dispatch({ type: RETRO_FILTER_CARDS, searchTerm }),
  toggleSortByVotes: () => dispatch({ type: RETRO_TOGGLE_SORT })
});

export default withRouter(
  withStyles(styles, { withTheme: true })(
    connect(mapStateToProps, mapDispatchToProps)(ControlPanel)
  )
);
