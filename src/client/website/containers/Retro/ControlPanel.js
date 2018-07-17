import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { RETRO_SORT_BY_VOTES } from '../../reducers/retro';
import { RETRO_TOGGLE_SORT } from '../../actions/retro';
import ControlPanel from '../../components/Retro/ControlPanel';

const mapStateToProps = ({ retro }) => ({
  sort: retro[RETRO_SORT_BY_VOTES]
});

const mapDispatchToProps = dispatch => ({
  toggleSortByVotes: () => dispatch({ type: RETRO_TOGGLE_SORT })
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ControlPanel));
