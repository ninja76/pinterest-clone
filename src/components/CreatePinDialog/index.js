import React, { useCallback, useState, useReducer, setState, useEffect } from "react";
import { useAsync } from "react-async"
import axios from 'axios';
import * as firebase from 'firebase/app';
import Dropzone from 'react-dropzone'
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import InputAdornment from '@material-ui/core/InputAdornment';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import GetAppIcon from '@material-ui/icons/GetApp';
import cuid from "cuid";
import useStyles from './styles';

const s3Prefix = 'pins/';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const getPresignedPostData = (pinTitle, pinDescription, pinCredit, pinTags, image) => {
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
    fetch('http://chlover-833630845.us-east-1.elb.amazonaws.com/upload_url', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Auth': idToken
      },
      body: JSON.stringify({key: image.id})
      })
      .then(response => response.text())
      .then(json => {
        const presigndata = json;
        uploadFileToS3(pinTitle, pinDescription, pinCredit, pinTags, image, presigndata);
      })
      .catch(error => {
        console.log(error);
      });
  });  
};

const uploadFileToS3 = (pinTitle, pinDescription, pinCredit, pinTags, file, presignedPostData) => {
  const buffer = Buffer.from(file.src.replace(/^data:image\/\w+;base64,/, ""),'base64');
  const result = axios.put(JSON.parse(presignedPostData).url, buffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Encoding': 'base64'
    },
  }).then(function (response) {
     submitPin(pinTitle, pinDescription, pinCredit, pinTags, file);
  });
};

const submitPin = (pinTitle, pinDescription, pinCredit, pinTags, image) => {
  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
    fetch('http://chlover-833630845.us-east-1.elb.amazonaws.com/pins', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Auth': idToken
      },
      body: JSON.stringify({title: pinTitle, 
                            description: pinDescription, 
                            imageId: image.id, 
                            credit: pinCredit,
                            tags: pinTags,
                            url: '',
                            userId: 1})
      })
      .then(response => {
        const statusCode = response.status;
        if (statusCode != 204) {
          console.log(statusCode);
        };
      })
      .catch(error => {
        console.log(error);
      });
  });
}

export default function CreatePinDialog(props) {
  let open = props.open;
  const classes = useStyles();

  const [pinTitle, setPinTitle] = useState("");
  const [pinDescription, setPinDescription] = useState("");
  const [pinWebsite, setPinWebsite] = useState("");
  const [pinDestinationLink, setPinDestinationLink] = useState("");
  const [pinCredit, setPinCredit] = useState("");
  const [pinTags, setPinTags] = useState([]);

  const [tagArray, dispatch] = useReducer((tagArray, { type, value }) => {
    switch (type) {
      case "add":
        return [...tagArray, value];
      case "remove":
        return tagArray.filter((_, index) => index !== value);
      default:
        return tagArray;
    }
  }, []);
  
  const [images, setImages] = useState([]);

  const handleCreate = () => {
    getPresignedPostData(pinTitle, pinDescription, pinCredit, pinTags, images[0]);
    props.handleClose();
  };

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.map(file => {
      const reader = new FileReader();
      var fileExt = file.name.split('.').slice(-1)[0];
      if (fileExt == 'jpeg') {
        fileExt = 'jpg';
      }
      reader.onload = function(e) {
        setImages(prevState => [
          ...prevState,
          { id: s3Prefix + cuid() + '.' + fileExt, src: e.target.result }
        ]);
      };
      reader.readAsDataURL(file);
      return file;
    });
  }, [])

  const fetchImage = async () => {
    var myRequest = new Request('https://cors-anywhere.herokuapp.com/' + pinWebsite);
    let response = await fetch(myRequest, { headers: {'X-Requested-With': 'foobar'} });

    if (response.ok) { // if HTTP-status is 200-299
      response.arrayBuffer().then((buffer) => {
        var base64Flag = 'data:image/jpeg;base64,';
        var imageStr = arrayBufferToBase64(buffer);
        setImages([
          { id: s3Prefix + cuid() + '.jpg', src: 'data:image/jpeg;base64,' + arrayBufferToBase64(buffer) }
        ]);
      })
    } else {
    }
  }

  function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  };

  function RenderDropzone(props) {
    return <Dropzone onDrop={onDrop} className={classes.baseStyle}> 
             {({getRootProps, getInputProps}) => (
               <div {...getRootProps()} className={classes.baseStyle}>
                 <CloudUploadIcon/>
                 <input {...getInputProps()} />
                 Drag n drop or click to upload
               </div>
             )}
           </Dropzone>
  }

  const deleteImages = () => {
    setImages([]);
  }

  return (
      <Dialog fullScreen open={open} onClose={props.handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={props.handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Create Pin 
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12} md={5} style={{height: 400, alignItems: 'center'}} >
              <Grid container justify="center" spacing={2} style={{paddingTop: 25}}>
                {images.length > 0 ? (
                  <div>
                    <IconButton
                      onClick={deleteImages}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <img src={images[0].src} style={{width: 250, borderRadius: 20}}/>
                  </div>
                ) : (
                  <div style={{width: '100%'}}> 
                    <RenderDropzone/>
                    <TextField
                      id="pinWebsite"
                      style={{width: '100%'}}
                      label="or get image from url"
                      placeholder="Enter website"
                      value={pinWebsite}
                      onChange={e => setPinWebsite(e.target.value)}
                      disabled={images.length > 0 ? true:false}
                      InputProps={{
                        endAdornment:
                          <InputAdornment position="end">
                            <IconButton
                              onClick={fetchImage}
                              disabled={pinWebsite ? false:true}>
                              <GetAppIcon />
                            </IconButton>
        
                          </InputAdornment>
                      }}
                    />
                  </div>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} md={5}>
              <div>
                <div>
                <TextField
                  id="pinTitle"
                  label="Pin Title"
                  style={{width: '100%'}}
                  value={pinTitle}
                  onChange={e => setPinTitle(e.target.value)}
                />
                </div>
              </div>
              <div>
                <TextField
                  id="pinDescription"
                  label="Tell us about your pin"
                  multiline
                  rowsMax="4"
                  className={classes.textField}
                  margin="normal"
                  style={{width: '100%'}}
                  value={pinDescription}
                  onChange={e => setPinDescription(e.target.value)}
                />
                <TextField
                  id="pinCredit"
                  label="Credit for Image"
                  multiline
                  rowsMax="4"
                  className={classes.textField}
                  margin="normal"
                  style={{width: '100%'}}
                  value={pinCredit}
                  onChange={e => setPinCredit(e.target.value)}
                />
                <TextField
                  id="pinDestinationLink"
                  style={{width: '100%'}}
                  label="Destination Link"
                  value={pinDestinationLink}
                  onChange={e => setPinDestinationLink(e.target.value)}
                />
                <Autocomplete
                  multiple
                  id="tags-filled"
                  defaultValue={[]}
                  freeSolo
                  onChange={e => setPinTags([...pinTags, e.target.value])}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip 
                        variant="outlined" 
                        label={option} 
                        onDelete={() => {
                          setPinTags(pinTags.filter(value => value !== option));
                        }}
                        {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="filled"
                      label="Tags"
                      fullWidth
                    />
                  )}
                />
              </div>
              {pinTags}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions color='transparent'>
          <Button onClick={props.handleClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            color="primary"
            disabled={images.length > 0 ? false:true}>
            Create 
          </Button>
        </DialogActions>
      </Dialog>
  );
}
