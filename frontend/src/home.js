import React, { useState, useEffect, useCallback } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import cblogo from "./cblogo.PNG";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress } from "@material-ui/core";
import { Clear, CloudUpload } from '@material-ui/icons';
import axios from "axios";
import { DropzoneArea } from 'material-ui-dropzone';

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(theme.palette.common.white),
    backgroundColor: theme.palette.common.white,
    '&:hover': {
      backgroundColor: '#ffffff7a',
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  clearButton: {
    width: "100%",
    borderRadius: "30px",
    padding: "15px 22px",
    color: "#007bff",
    fontSize: "20px",
    fontWeight: 900,
    boxShadow: "0 4px 15px rgba(0, 123, 255, 0.4)",
    transition: "all 0.3s ease",
    '&:hover': {
      backgroundColor: "#0056b3",
      color: "white",
      boxShadow: "0 6px 20px rgba(0, 86, 179, 0.7)",
    }
  },
  root: {
    maxWidth: 600,
    flexGrow: 1,
    borderRadius: "20px",
    boxShadow: "0 8px 30px rgba(0, 123, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  uploadCard: {
    maxWidth: 450,
    flexGrow: 1,
    borderRadius: "20px",
    border: "2px dashed #007bff",
    boxShadow: "0 4px 15px rgba(0, 123, 255, 0.1)",
    backgroundColor: "white",
  },
  media: {
    height: 400,
    borderRadius: "20px 20px 0 0",
    objectFit: "contain",
    maxWidth: "100%",
    maxHeight: "400px",
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  gridContainer: {
    justifyContent: "center",
    padding: "3em 1em 0 1em",
  },
  mainContainer: {
    background: 'linear-gradient(135deg, #e3f2fd 0%, #f8f9ff 100%)',
    minHeight: "100vh",
    marginTop: "8px",
    padding: "2rem 1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  uploadSection: {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "2rem",
    maxWidth: 500,
    minHeight: "400px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
    border: "2px dashed #007bff",
    boxShadow: "0 4px 15px rgba(0, 123, 255, 0.1)",
    gap: "1rem",
  },
  uploadTitle: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#0056b3",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
  uploadIcon: {
    fontSize: "2rem",
    color: "#17a2b8",
  },
  resultSection: {
    marginTop: "2rem",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    padding: "1.5rem 2.5rem",
    boxShadow: "0 4px 20px rgba(0, 123, 255, 0.3)",
    maxWidth: 600,
    minWidth: 450,
  },
  appbar: {
    background: '#007bff',
    boxShadow: 'none',
    color: 'white',
  },
  loader: {
    color: '#17a2b8 !important',
  },
  headerText: {
    fontSize: "2.5rem",
    fontWeight: "900",
    color: "#0056b3",
    marginBottom: "0.5rem",
    textAlign: "center",
  },
  subHeaderText: {
    fontSize: "1.2rem",
    color: "#007bff",
    marginBottom: "2rem",
    textAlign: "center",
  },
  uploadText: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#007bff",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  }
}));

export const ImageUpload = () => {
  const classes = useStyles();
const [selectedFile, setSelectedFile] = useState();
const [preview, setPreview] = useState();
const [data, setData] = useState();
const [error, setError] = useState(null);
const [Image, setImage] = useState(false);
const [isLoading, setIsloading] = useState(false);

  let confidence = 0;

  const sendFile = useCallback(async () => {
    if (Image) {
      setError(null);
      try {
        let formData = new FormData();
        formData.append("file", selectedFile);
        let res = await axios({
          method: "post",
          url: process.env.REACT_APP_API_URL,
          data: formData,
        });
  
        if (res.status === 200) {
          setData(res.data);
        } else {
          setError(`API request failed with status code: ${res.status}`);
          console.error(`API request failed with status code: ${res.status}`);
        }
      } catch (error) {
        setError("Prediction failed. Please ensure the backend server is running and try again.");
        console.error("API request failed:", error);
      } finally {
        setIsloading(false);
      }
    }
  }, [Image, selectedFile, setData, setIsloading, setError]);

  const clearData = () => {
    setData(null);
    setError(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    setIsloading(true);
    sendFile();
  }, [preview, sendFile]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      setError(null);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setError(null);
    setImage(true);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            CSE499: Leukemia Blood Cell Cancer Classification
          </Typography>
          <div className={classes.grow} />
          <Avatar src={cblogo} />
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
        <Typography className={classes.headerText}>
          Leukemia Blood Cell Cancer Detection
        </Typography>
        <Typography className={classes.subHeaderText}>
          Upload an image of a blood cell to detect leukemia with high accuracy.
        </Typography>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
            <Card className={Image ? classes.root : classes.uploadCard}>
              {Image && (
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    component="img"
                    src={preview}
                    title="Uploaded Blood Cell"
                  />
                </CardActionArea>
              )}
              {!Image && (
                <CardContent className={classes.uploadSection}>
                  <Typography className={classes.uploadText}>
                    Upload Blood Cell Image for Leukemia Detection
                  </Typography>
                  <DropzoneArea
                    acceptedFiles={['image/*']}
                    dropzoneText="Drag & drop your blood cell image or click here to select."
                    onChange={onSelectFile}
                    showPreviews={false}
                    filesLimit={1}
                    maxFileSize={5000000}
                    dropzoneClass={classes.dropzone}
                    style={{ flex: 1, width: '100%', minHeight: '150px' }}
                  />
                </CardContent>
              )}
              {data && (
                <CardContent className={classes.resultSection}>
                  <Typography variant="h6" style={{ textAlign: "center", marginBottom: "1rem", color: data.class === 'Benign' ? "#28a745" : "#dc3545", fontWeight: "bold" }}>
                    {data.class === 'Benign' ? 'No leukemia detected.' : `Leukemia detected: ${data.class}`}
                  </Typography>
                  {selectedFile && (
                    <Typography variant="body2" style={{ textAlign: "center", marginBottom: "1rem", color: "#6c757d" }}>
                      Analyzed image: {selectedFile.name}
                    </Typography>
                  )}
                  <TableContainer component={Paper} elevation={0} style={{ width: "100%", overflowX: "auto" }}>
                    <Table size="medium" aria-label="result table">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ padding: "12px 24px", fontWeight: "bold" }}>Label</TableCell>
                          <TableCell align="right" style={{ padding: "12px 24px", fontWeight: "bold" }}>Confidence</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell style={{ padding: "12px 24px" }}>{data.class}</TableCell>
                          <TableCell align="right" style={{ padding: "12px 24px" }}>{confidence}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              )}
              {isLoading && (
                <CardContent className={classes.resultSection}>
                  <CircularProgress color="secondary" className={classes.loader} />
                  <Typography variant="h6" style={{ color: "#17a2b8", marginTop: "1rem", textAlign: "center" }}>
                    Matching... Please Wait...
                  </Typography>
                </CardContent>
              )}
              {error && (
                <CardContent className={classes.resultSection} style={{ backgroundColor: "#ffebee", color: "#c62828" }}>
                  <Typography variant="body1" style={{ textAlign: "center" }}>
                    Error: {error}
                  </Typography>
                </CardContent>
              )}
            </Card>
          </Grid>
          {data && (
            <Grid item xs={12} md={4} style={{ display: "flex", alignItems: "center" }}>
              <ColorButton
                variant="contained"
                className={classes.clearButton}
                color="primary"
                size="large"
                onClick={clearData}
                startIcon={<Clear fontSize="large" />}
              >
                Clear
              </ColorButton>
            </Grid>
          )}
        </Grid>
      </Container>
    </React.Fragment>
  );
};
