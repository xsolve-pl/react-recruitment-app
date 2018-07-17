import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'material-ui';
import { FormattedMessage } from 'react-intl';


const ControlPanel = ({ toggleSortByVotes, sort }) => (
  <div>
    {sort}
    <Button
      raised
      size="medium"
      color="primary"
      onClick={toggleSortByVotes}
    >
      <FormattedMessage id="retro.sort-by-votes" />
    </Button>
  </div>
);

ControlPanel.propTypes = {
  sort: PropTypes.bool.isRequired,
  // Functions
  toggleSortByVotes: PropTypes.func.isRequired
};

export default ControlPanel;
