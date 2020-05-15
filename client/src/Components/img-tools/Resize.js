import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid'
import axios from 'axios'
import ImagePro from '../UI/ImagePro';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Wrapper } from './Compress'
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));
export default function Resize() {
    const [imgSrc, setimgSrc] = useState('')
    const [modSrc, setmodSrc] = useState('')
    const [type, settype] = useState(0)
    const [file, setfile] = useState(null)
    const [modFile, setmodFile] = useState(null)
    const [fileName, setfileName] = useState(null)
    const [width, setWidth] = useState(null)
    const [height, setHeight] = useState(null)
    const [aspect, setAspect] = useState(true)
    const [initialAspect, setInitialAspect] = useState(0)
    const [backdrop, setbackdrop] = useState(false)

    const classes = useStyles();

    const handleUpload = (e) => {
        setbackdrop(true)
        let imgFile = e.target.files[0]
        let form_data = new FormData();
        form_data.append('image', imgFile);
        let url = '/api/upload';
        axios.post(url, form_data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then(res => {
                console.log(res.data)
                if (res.data.success === 1) {
                    setimgSrc(res.data.file.url)
                    setfile(res.data.file)
                    setfileName(res.data.file.fileName)
                    setWidth(res.data.file.dimensions.width)
                    setHeight(res.data.file.dimensions.height)
                    setInitialAspect(res.data.file.dimensions.width / res.data.file.dimensions.height)
                    setTimeout(() => {
                        setbackdrop(false)
                    }, 400);
                }
            })
            .catch(err => console.log(err))
    };

    const resizeImage = () => {
        axios({
            method: 'post',
            url: '/api/resize',
            data: {
                image: fileName,
                width: width,
                height: height,
                aspect: aspect
            }
        })
            .then(res => {
                console.log(res.data)
                if (res.data.success === 1) {
                    setmodSrc(res.data.file.url)
                    setmodFile(res.data.file)
                }
            })
            .catch(err => console.log(err))
    }
    function downloadMod() {
        const linkSource = modSrc;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = 'sample';
        downloadLink.click();
    }
    const handleWidthChange = (e) => {
        setWidth(e.target.value)

        if (aspect) {
            let calcHeight = Number(e.target.value) / Number(initialAspect)
            setHeight(calcHeight)
        }
    }


    return (
        <Wrapper maxWidth="md">
            <div style={{ marginTop: '30px' }}>
                <Grid container direction="row" justify="center"
                    alignItems="center">
                    <div class='file-input'>
                        <input type='file' id="img" name="img" accept="image/*" onChange={(e) => handleUpload(e)} />
                        <span class='button'>Choose Image</span>
                        <span class='label' data-js-label>No File Chosen</span>
                    </div>
                </Grid>
                <Grid container direction="row">
                    <Grid item sm={6}>
                        {file && (<>
                            <h5>Original Image</h5>
                            <div style={{ textAlign: 'center' }}>
                                <img src={imgSrc} width={file.dimensions.width} style={{ maxWidth: '350px' }} />
                            </div>
                        </>)}
                    </Grid>
                    <Grid item sm={6}>
                        {modFile && (<>
                            <h5>Processed Image</h5>
                            <div style={{ textAlign: 'center' }}>
                                <img src={modSrc} width={modFile.dimensions.width} style={{ maxWidth: '350px' }} />
                            </div>
                        </>)}
                    </Grid>
                </Grid>
                <Grid container direction="row">
                    <Grid item sm={6}>{file && (<ImagePro file={file} />)}</Grid>
                    <Grid item sm={6}> {modFile && (<ImagePro file={modFile} />)}</Grid>
                </Grid>
                <Grid container direction="row" justify="space-between" style={{ margin: '10px' }}>
                    {file && (<>
                        <Grid>
                            <FormHelperText>Width</FormHelperText>
                            <TextField
                                id="outlined-name"
                                value={width}
                                onChange={handleWidthChange}
                                variant="outlined"
                                color="primary"
                            />
                        </Grid>
                        <Grid>
                            <FormHelperText>Height</FormHelperText>
                            <TextField
                                id="outlined-uncontrolled"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                variant="outlined"
                                disabled={aspect}
                                color="secondary"
                            /></Grid>
                        <Grid>
                            <FormHelperText>To Maintain aspect ratio height adjustment is disabled </FormHelperText>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={aspect}
                                        onChange={(e) => setAspect(e.target.checked)}
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />}
                                label="Maintain Aspect Ratio"
                            />
                        </Grid>
                    </>)}
                </Grid>
                <Grid container direction="row">
                    {file && (<Button variant="contained" color="primary" onClick={resizeImage}>
                        Resize
                    </Button>)}
                    {modSrc && (<>
                        <a href={modSrc} download={`${file.fileName}-mod.${file.extension}`}>
                            <Button variant="outlined" color="secondary" >
                                Download
                    </Button>
                        </a>
                    </>)}
                </Grid>
            </div>
            <Backdrop className={classes.backdrop} open={backdrop}>
                <CircularProgress color="primary" />
            </Backdrop>
        </Wrapper >
    )
}
