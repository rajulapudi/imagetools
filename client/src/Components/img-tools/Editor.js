import React, { useState } from 'react'
import FilerobotImageEditor from 'filerobot-image-editor';
import Grid from '@material-ui/core/Grid'
import axios from 'axios'
import Button from '@material-ui/core/Button'
import ImagePro from '../UI/ImagePro';
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

export default function Editor() {
    const [open, setopen] = useState(false)
    const [imgSrc, setimgSrc] = useState(null)
    const [file, setfile] = useState(null)
    const [fileName, setfileName] = useState(null)
    const [backdrop, setbackdrop] = useState(false)
    const config = {
        tools: ['adjust', 'effects', 'filters', 'rotate', 'crop', 'resize', 'watermark'],
    }
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
                    setTimeout(() => {
                        setbackdrop(false)
                    }, 400);
                }
            })
            .catch(err => console.log(err))
    };
    return (
        <Wrapper>
            <Grid container direction="row" justify="center"
                alignItems="center">
                <div class='file-input'>
                    <input type='file' id="img" name="img" accept="image/*" onChange={(e) => handleUpload(e)} />
                    <span class='button'>Choose Image</span>
                    <span class='label' data-js-label>No File Chosen</span>
                </div>
            </Grid>
            <Grid container direction="row">
                {imgSrc && (
                    <Grid>
                        <h5>Original Image</h5>
                        <img src={imgSrc} width={200} />
                        {file && (<ImagePro file={file} />)}
                    </Grid>
                )}
            </Grid>
            {imgSrc && (
                <Button variant="contained" color="primary" onClick={() => setopen(true)}>
                    Edit Image
                </Button>
            )}
            <FilerobotImageEditor
                show={open}
                src={imgSrc}
                onClose={() => setopen(false)}
                config={config}
            />
                        <Backdrop className={classes.backdrop} open={backdrop}>
                <CircularProgress color="primary" />
            </Backdrop>
        </Wrapper>
    )
}
