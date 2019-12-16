import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles(theme => ({
  card: {
    padding: 5,
    backgroundColor: '#fafafa',
    boxShadow: 'rgba(250, 250, 250, 0) 0px 1px 6px, rgba(250, 250, 250, 0) 0px 1px 4px'
  },
  content: {
    flex: '1 0 auto',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  media: {
    borderRadius: 20,
    height: 'auto' 
//    paddingTop: '66.25%', // 16:9
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function RecipeReviewCard(props) {
  const classes = useStyles();

  const onError = (ev) => {
    ev.target.src = 'https://via.placeholder.com/300?text=Image+not+found+:{'
  }

  return (
    <Card key={props.id} className={classes.card}>
      <div className={classes.details}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            B
          </Avatar>
        }
        title={props.title}
        subheader="September 14, 2016"
      />
      <img key={props.images} src={props.image} onError={onError} style={{maxWidth: 300}}/>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
      </div>
    </Card>
  );
}
