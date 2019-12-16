import React, { useCallback, useState, setState, useEffect } from "react";
import Fab from '@material-ui/core/Fab';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import useStyles from './styles';

export default function ImageTile(props) {
  const classes = useStyles();

   const [favorite, setFavorite] = useState(false);

  const isMobile = window.innerWidth < 480;
  const imageMaxWidth = isMobile ? 175 : 350;

  const onError = (ev) => {
    ev.target.src = 'https://via.placeholder.com/300?text=Image+not+found'
  }

  const toggleFavorite = () => {
    if (favorite == true) {
      setFavorite(false);
    } else {
      setFavorite(true);
    }
  }

  return (
    <div className={classes.imgWrapper}>
      <img key={props.image} src={props.image} onError={onError} style={{maxWidth: imageMaxWidth}} />
      <GridListTileBar
        style={{bottom: 5, background:
      'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)'}}
        title={props.title}
        actionIcon={
          <IconButton aria-label={`info about ${props.title}`} className={classes.icon} onClick={toggleFavorite}>
            { favorite == true ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
          </IconButton>
        }
                        
      >
      </GridListTileBar>
    </div>
  );
}
