import React, { Component } from 'react';
import { Parser } from 'json2csv';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Tooltip,
  Typography,
  IconButton
} from 'material-ui';
import CloudDownload from 'material-ui-icons/CloudDownload';
import { CircularProgress } from 'material-ui/Progress';
import {
  QUERY_ERROR_KEY,
  QUERY_STATUS_FAILURE,
  QUERY_STATUS_KEY,
  QUERY_STATUS_SUCCESS,
  queryFailed,
  QueryShape,
  querySucceeded
} from '../../services/websocket/query';
import Column from '../../containers/Retro/Column';
import Steps from '../../containers/Retro/Steps';
import { initialsOf } from '../../services/utils/initials';
import ControlPanel from '../../containers/Retro/ControlPanel';
import ConfirmActionDialog from '../../containers/ConfirmActionDialog';

class Retro extends Component {
  componentWillMount() {
    this.joinRetro();
  }

  componentWillReceiveProps(nextProps) {
    const { addColumnQuery, connectQuery, addMessage } = this.props;
    const { addColumnQuery: nextAddColumnQuery, connectQuery: nextConnectQuery } = nextProps;
    if (queryFailed(addColumnQuery, nextAddColumnQuery)) {
      addMessage(nextAddColumnQuery[QUERY_ERROR_KEY]);
    }
    if (querySucceeded(connectQuery, nextConnectQuery)) {
      this.joinRetro();
    }
  }

  createCSV = () => {
    const { cards, columns, shareId } = this.props;
    const dataToCSV = columns.reduce((data, currentColumn) => {
      const columnCards = cards.filter(card => card.columnId === currentColumn.id);
      columnCards.forEach((card) => {
        data.push({
          columnName: currentColumn.name,
          cardText: card.text,
          votesNumber: card.votes.length
        });
      });
      return data;
    }, []);
    const filename = `${shareId}.csv`;
    const fields = ['columnName', 'cardText', 'votesNumber'];
    const json2Csv = new Parser({ fields });
    const blob = new Blob([json2Csv.parse(dataToCSV)], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };
  joinRetro = () => {
    const { joinRetro, match: { params: { retroShareId } } } = this.props;
    const { socket } = this.context;
    joinRetro(socket, retroShareId);
  };

  render() {
    const {
      step,
      classes,
      columns,
      users,
      history,
      joinRetroQuery: {
        [QUERY_STATUS_KEY]: joinStatus,
        [QUERY_ERROR_KEY]: joinError
      }
    } = this.props;
    switch (joinStatus) {
      case QUERY_STATUS_SUCCESS:
        return (
          <div className={classes.root}>
            <Steps />
            <ControlPanel />
            <div className={classes.columns}>
              {columns.map(column => (
                <Column key={column.id} column={column} />
              ))}
            </div>
            {
              step &&
              <ConfirmActionDialog
                key="export-data"
                TriggeringComponent={({ onClick }) => (
                  <IconButton
                    key="download"
                    size="big"
                    color="primary"
                    className={classes.exportButton}
                  >
                    <CloudDownload onClick={onClick} />
                  </IconButton>
                )}
                textContent={<FormattedMessage id="retro.export" />}
                onConfirm={this.createCSV}
              />
            }
            <div className={classes.users}>
              {Object.values(users).map(({ id, name }) => (
                <Tooltip key={id} title={name} placement="left">
                  <Avatar
                    alt={name}
                    className={classes.avatar}
                  >
                    {initialsOf(name)}
                  </Avatar>
                </Tooltip>
              ))}
            </div>
          </div>
        );
      case QUERY_STATUS_FAILURE:
        return (
          <div className={classes.root}>
            <Card className={classes.messageCard}>
              <Typography type="headline">Error</Typography>
              <CardContent>
                <Typography>{joinError}</Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => history.goBack()}>Back</Button>
              </CardActions>
            </Card>
          </div>
        );
      default:
        return (
          <div className={classes.root}>
            <Card className={classes.messageCard}>
              <CircularProgress color="primary" />
            </Card>
          </div>
        );
    }
  }
}

Retro.contextTypes = {
  socket: PropTypes.object.isRequired
};
Retro.defaultProps = {
  shareId: '',
  step: ''
};
Retro.propTypes = {
  // Values
  shareId: PropTypes.string,
  step: PropTypes.string,
  history: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      retroShareId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  cards: PropTypes.arrayOf(PropTypes.shape({
    columnId: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  })).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  })).isRequired,
  users: PropTypes.object.isRequired,
  // Queries
  connectQuery: PropTypes.shape(QueryShape).isRequired,
  joinRetroQuery: PropTypes.shape(QueryShape).isRequired,
  addColumnQuery: PropTypes.shape(QueryShape).isRequired,
  // Functions
  joinRetro: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  // Styles
  classes: PropTypes.shape({
    avatar: PropTypes.string.isRequired,
    root: PropTypes.string.isRequired,
    messageCard: PropTypes.string.isRequired,
    columns: PropTypes.string.isRequired,
    users: PropTypes.string.isRequired,
    hidden: PropTypes.string.isRequired,
    exportButton: PropTypes.string.isRequired
  }).isRequired
};

export default Retro;
