import React, { useCallback, useState, setState, useEffect } from "react";
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import axios from "axios";
import { ThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AddIcon from '@material-ui/icons/Add';
import ImageTile from './components/ImageTile';
import SearchAppBar from './components/AppBar';
import CreatePinDialog from './components/CreatePinDialog';
import Masonry from 'react-masonry-component';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

const masonryOptions = {
  isFitWidth: true
};

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
}));

function App(props) {
  const {
    user,
    signOut,
    signInWithGoogle,
  } = props;

  const classes = useStyles();
  const [pins, setPins] = useState();
  const [createPinDialogOpen, setCreatePinDialogOpen] = useState(false);

  const handleClickOpen = () => {
    setCreatePinDialogOpen(true);
  };

  const handleClose = () => {
    setCreatePinDialogOpen(false);
  };

  useEffect(() => {
   axios
     .get(
       "http://chlover-833630845.us-east-1.elb.amazonaws.com/pins"
     )
     .then(({ data }) => {
      setPins(data);
     });
  }, []);

  return pins ? ( 
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SearchAppBar user={user} signOut={signOut} signInWithGoogle={signInWithGoogle} />
      <Box justifyContent="center" m={1} p={1} style={{paddingTop: 75, maxWidth: 1280, margin: '0 auto'}}>
        <Masonry
          style={{margin: '0 auto'}}
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
          options={masonryOptions}
        >
          {pins.map(tile => (
            <ImageTile title={tile.title} id={tile.imageId} key={tile.imageId} image={'https://roxlr-thumbs.s3.amazonaws.com/pins/resized/small/' + tile.imageId.split('/')[1]} name={tile.title} />
          ))}
        </Masonry>
      </Box> 
       {
         user
           ? <Fab color="primary"
               aria-label="add"
               onClick={handleClickOpen}
               className={classes.fab}>
                 <AddIcon />
               </Fab> 
            :
              <Fab color="primary"
               aria-label="add"
               onClick={() => signInWithGoogle()}
               className={classes.fab}>
                 <AddIcon />
               </Fab>
            }
      <CreatePinDialog open={createPinDialogOpen} handleClose={handleClose} token={firebase.auth().currentUser} />
    </ThemeProvider>
    ) : (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div>
          <SearchAppBar />
        </div>
        Loading.....
      </ThemeProvider>)
  }

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
