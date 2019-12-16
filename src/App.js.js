import React from 'react';
import { ThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import SearchAppBar from './components/AppBar';
import shoeData from './shoedata';

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  gridList: {
    maxWidth: 960,
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
}));

export default function ImageGridList() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <SearchAppBar />
        <div className={classes.root}>
        <GridList cellHeight={180}  spacing={4} className={classes.gridList}>
        {shoeData.map(tile => (
          <GridListTile key={tile.imageUrl} cols={1} rows={1} style={{ maxWidth: 300, height: 'auto'  }}>
            <img src={'https://roxlr-thumbs.s3.amazonaws.com/' + tile.imageUrl.split('.')[0] + '_0.jpg'} alt={tile.name} />
            <GridListTileBar
              title={tile.name}
              titlePosition="top"
              actionIcon={
                <IconButton aria-label={`star ${tile.name}`} className={classes.icon}>
                  <StarBorderIcon />
                </IconButton>
              }
              actionPosition="left"
              className={classes.titleBar}
            />
          </GridListTile>
        ))}
      </GridList>
      </div>
    </ThemeProvider>
  );
}
