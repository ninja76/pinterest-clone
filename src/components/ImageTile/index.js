import React, { useCallback, useState, setState, useEffect } from "react";
import * as firebase from 'firebase/app';
import Fab from '@material-ui/core/Fab';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import useStyles from './styles';

export default function ImageTile(props) {
  const classes = useStyles();

   const [favorite, setFavorite] = useState(props.pin.like);

  const isMobile = window.innerWidth < 480;
  const imageMaxWidth = isMobile ? 175 : 350;

  const onError = (ev) => {
    ev.target.src = 'https://via.placeholder.com/300?text=Image+not+found'
  }

  const toggleFavorite = () => {
    firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
      fetch('http://chlover-833630845.us-east-1.elb.amazonaws.com/pins/' + props.pin.id + '/like', {
        method: 'get',
        headers: {
          'Auth': idToken
        }
      })
      .then(response => response.text())
      .catch(error => {
        console.log(error);
      })
    })

    if (favorite == true) {
      props.pin.like = false;
      setFavorite(false);
    } else {
      props.pin.like = true;
      setFavorite(true);
    }
  }

  return (
    <div className={classes.imgWrapper}>
      <img key={props.image} src={props.image} onError={onError} style={{maxWidth: imageMaxWidth}} />
      <GridListTileBar
        style={{bottom: 5, background:
      'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)'}}
        title={props.pin.title}
        actionIcon={
          <IconButton 
            className={classes.icon} 
            onClick={() => toggleFavorite()}
          >
            { props.pin.like == true ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
          </IconButton>
        }
      >
      </GridListTileBar>
    </div>
  );
}
