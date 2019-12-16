import React, { useCallback, useState, setState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Dropzone from 'react-dropzone'
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import TextField from '@material-ui/core/TextField';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import cuid from "cuid";

const getPresignedPostData = (image) => {
  fetch('http://chlover-833630845.us-east-1.elb.amazonaws.com/upload_url', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({key: image.id})
    })
    .then(response => response.text())
    .then(json => {
      const presigndata = json;
      uploadFileToS3(image, presigndata);
    })
    .catch(error => {
      console.log(error);
    });
};

const uploadFileToS3 = (file, presignedPostData) => {
    const formData = new FormData();
    Object.keys(JSON.parse(presignedPostData).fields).forEach(key => {
      if (key == 'key') {
        formData.append(key, file.id);
      } else {
        formData.append(key, JSON.parse(presignedPostData).fields[key]);
      }
    });
    // Actual file has to be appended last.
    formData.append("file", file.src);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", JSON.parse(presignedPostData).url, true);
    xhr.send(formData);
    xhr.onload = function() {
      console.log(this.status);
    };
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 600
  },
  baseStyle: {
    width: '100%',
    height: 300,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    verticalAlign: 'middle',
    paddingTop: 150,
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  },
  resize:{
    fontSize:50
  }
}));

function ImageDropzone(props) {
  const classes = useStyles();

  // Rendering individual images
  const Image = ({ image }) => {
    return (
      <GridListTile key={image.id} cols={2} spacing={4}>
        <img alt={`img - ${image.id}`} src={image.src} style={{padding: 10, height: 200, width: 200}}/>
      </GridListTile>
    );
  }

  // ImageList Component
  const ImageList = ({ images }) => {
    const renderImage = (image, index) => {
      getPresignedPostData(image)
      return (
        <Image
          image={image}
          key={`${image.id}-image`}
        />
      );
    }
    return <div className={classes.root}><GridList spacing={4} cellHeight={180} className={classes.gridList} cols={3}>{images.map(renderImage)}</GridList></div>;
  }

  const [pinTitle, setPinTitle] = useState("");
  const [pinDescription, setPinDescription] = useState("");

  const onPinTitleChange = (e) => {
    setPinTitle(e.target.value);
    props.updatePinTitle(e.target.value);
  }

  const onPinDescriptionChange = (e) => {
    setPinDescription(e.target.value);
  }

  const [images, setImages] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.map(file => {
      console.log(file.name);
      const reader = new FileReader();
      reader.onload = function(e) {
        console.log({ id: cuid() + '.jpg', src: e.target.result });
        setImages(prevState => [
          ...prevState,
          { id: cuid() + '.jpg', src: e.target.result }
        ]);
      };
      reader.readAsDataURL(file);
      return file;
    });
  }, []);

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={5}>   
          <Dropzone onDrop={onDrop} className={classes.baseStyle}>
            {({getRootProps, getInputProps}) => (
              <div {...getRootProps()} className={classes.baseStyle}>
                <CloudUploadIcon/>        
                <input {...getInputProps()} />
                Drag n drop or click to upload 
              </div>
            )}
          </Dropzone>
          <ImageList images={images} />
        </Grid>
        <Grid item xs={5}>
          <div>
            <TextField 
              id="pinTitle" 
              label="Pin Title" 
              style={{width: '100%'}}
              value={pinTitle}
              onChange={e => onPinTitleChange(e)}
            />
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
          </div>
        </Grid>
      </Grid>
      <TextField
        id="pinWebsite"
        style={{width: '100%'}}
        label="Save from site"
        placeholder="Enter website"
      />
      <TextField
        id="pinDestinationLink"
        style={{width: '100%'}}
        label="Destination Link"
      />
    </div>
  );

}

export default ImageDropzone;
