const styles = theme => ({
  columns: {
    display: 'flex',
    width: '100%',
    flexFlow: 'row wrap',
    padding: '0 4%'
  },
  column: {
    display: 'flex',
    flex: '1 0 auto',
    flexFlow: 'column',
    alignSelf: 'stretch',
    minWidth: 300,
    maxWidth: '100%',
    margin: theme.spacing.unit,
    borderRadius: 3,
    padding: theme.spacing.unit
  }
});

export default styles;
