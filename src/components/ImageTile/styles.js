import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  title: {
    color: theme.palette.primary.light,
  },
  imgWrapper: {
    display: 'inline-block',
    position: 'relative',
    cursor: 'pointer',
    marginRight: 5
  },
  titleBar: {
    height: 50,
    bottom: 5,
    left: 0,
    right: 0,
    display: 'block',
    paddingLeft: 10,
    paddingTop: 10,
    color: '#fff',
    fontSize: 18,
    fontWeight: 500,
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  }
}));

export default useStyles;
