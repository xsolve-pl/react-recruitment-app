import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, TextField, FormControlLabel } from 'material-ui';
import { FormattedMessage } from 'react-intl';

const SEARCH_TERM_MIN_LENGTH = 2;

class ControlPanel extends Component {
  handleChange = (ev) => {
    const { filterCardsBy } = this.props;
    const searchTerm = ev.target.value;
    if (searchTerm.length >= SEARCH_TERM_MIN_LENGTH) {
      filterCardsBy(searchTerm);
    } else {
      filterCardsBy();
    }
  };

  handleSwitchChange = () => {
    const { toggleSortByVotes } = this.props;
    toggleSortByVotes();
  };

  render() {
    const { sort, classes } = this.props;
    return (
      <div className={classes.columns}>
        <div className={classes.column}>
          <TextField
            id="search"
            label={<FormattedMessage id="retro.filter-cards" />}
            type="search"
            margin="normal"
            onChange={this.handleChange}
          />
        </div>
        <div className={classes.column}>
          <FormControlLabel
            control={
              <Switch
                checked={sort}
                onChange={this.handleSwitchChange}
                color="primary"
              />
            }
            label={<FormattedMessage id="retro.sort-by-votes" />}
          />
        </div>
      </div>
    );
  }
}


ControlPanel.propTypes = {
  sort: PropTypes.bool.isRequired,
  // Functions
  filterCardsBy: PropTypes.func.isRequired,
  toggleSortByVotes: PropTypes.func.isRequired,
  // Styles
  classes: PropTypes.shape({
    column: PropTypes.string.isRequired,
    columns: PropTypes.string.isRequired
  }).isRequired
};

export default ControlPanel;
