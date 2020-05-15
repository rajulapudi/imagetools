import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'
import Container from '@material-ui/core/Container'
import Backdrop from '@material-ui/core/Backdrop';
import ImagePro from '../UI/ImagePro';
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';



const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

export default function Compress() {
    const [imgSrc, setimgSrc] = useState('')
    const [modSrc, setmodSrc] = useState('')
    const [oriH, setoriH] = useState(0)
    const [oriW, setoriW] = useState(0)
    const [oriS, setoriS] = useState(0)
    const [modH, setmodH] = useState(0)
    const [modW, setmodW] = useState(0)
    const [modS, setmodS] = useState(0)
    const [type, settype] = useState(0)
    const [file, setfile] = useState(null)
    const [modFile, setmodFile] = useState(null)
    const [fileName, setfileName] = useState(null)
    const [open, setOpen] = useState(false)

    const classes = useStyles();

    const handleUpload = (e) => {
        setOpen(true)
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
                    setoriH(res.data.file.dimensions.height)
                    setoriW(res.data.file.dimensions.width)
                    setoriS(res.data.file.size)
                    settype(res.data.file.extension)
                    setfile(res.data.file)
                    setfileName(res.data.file.fileName)
                    setTimeout(() => {
                        setOpen(false)
                    }, 400);
                }
            })
            .catch(err => console.log(err))
    };

    const compressImage = () => {
        setOpen(true)
        axios({
            method: 'post',
            url: '/api/compress',
            data: {
                image: fileName,
            }
        })
            .then(res => {
                console.log(res.data)
                if (res.data.success === 1) {
                    setmodSrc(res.data.file.url)
                    setmodH(res.data.file.dimensions.height)
                    setmodW(res.data.file.dimensions.width)
                    setmodS(res.data.file.size)
                    setmodFile(res.data.file)
                    setTimeout(() => {
                        setOpen(false)
                    }, 400);
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


    return (
        <Wrapper maxWidth="md">
            <Grid style={{ marginTop: '30px' }} justify="center"
                alignItems="center">
                <Grid container direction="row" justify="center"
                    alignItems="center">
                    <div class='file-input'>
                        <input type='file' id="img" name="img" accept="image/*" onChange={(e) => handleUpload(e)} />
                        <span class='button'>Choose Image</span>
                        <span class='label' data-js-label>No File Chosen</span>
                    </div>
                </Grid>
                <Grid container direction="row" >
                    {imgSrc && (
                        <Grid item sm={6}>
                            <h5>Original Image</h5>
                            <img src={imgSrc} width={200} />
                            {file && (<ImagePro file={file} />)}
                        </Grid>
                    )}
                    {modSrc && (
                        <Grid item sm={6}>
                            <h5>Processed Image</h5>
                            <img src={modSrc} width={200} />
                            {modFile && (<ImagePro file={modFile} />)}
                        </Grid>
                    )}
                </Grid>
                <Grid container direction="row">
                    {imgSrc && (
                        <Grid item sm={6}>
                            <Button variant="contained" color="primary" onClick={compressImage}>
                                Compress
                    </Button>
                        </Grid>
                    )}
                    {modSrc && (<Grid item sm={6}>
                        <a href={modSrc} download={`${file.fileName}-mod.${file.extension}`}>
                            <Button variant="outlined" color="secondary" >
                                Download
                        </Button>
                        </a>
                    </Grid>
                    )}
                </Grid>
            </Grid>
            <Backdrop className={classes.backdrop} open={open}>
                <CircularProgress color="primary" />
            </Backdrop>
        </Wrapper>
    )
}

export const Wrapper = styled(Container)`
text-align: center;
margin-top: 80px;
.file-input {
    display: inline-block;
    text-align: left;
    background: #fff;
    padding: 16px;
    width: 450px;
    position: relative;
    border-radius: 3px;
  }
  
  .file-input > [type='file'] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 10;
    cursor: pointer;
  }
  
  .file-input > .button {
    display: inline-block;
    cursor: pointer;
    background: dodgerblue;
    color: white;
    padding: 8px 16px;
    border-radius: 2px;
    margin-right: 8px;
  }
  
  .file-input:hover > .button {
    background: #eee;
    color: dodgerblue;
   
  }
  
  .file-input > .label {
    color: #333;
    white-space: nowrap;
    opacity: .3;
  }
  
  .file-input.-chosen > .label {
    opacity: 1;
  }
`
