import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'
import Container from '@material-ui/core/Container'
import ImagePro from '../UI/ImagePro';




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


    const handleUpload = (e) => {
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
                }
            })
            .catch(err => console.log(err))
    };
    const reCompressImage = () => {
        axios({
            method: 'post',
            url: '/api/compress',
            data: {
                image: modFile.fileName,
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
                }
            })
            .catch(err => console.log(err))
    }
    const compressImage = () => {
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
        <Container maxWidth="md">
            <div style={{ marginTop: '30px' }}>
                <Grid container direction="row">
                    <input type="file" id="img" name="img" accept="image/*" onChange={(e) => handleUpload(e)} />
                </Grid>
                <Grid container direction="row">
                    {imgSrc && (
                        <Grid>
                            <h5>Original Image</h5>
                            <img src={imgSrc} width={200} />
                            {file && (<ImagePro file={file} />)}
                        </Grid>
                    )}
                    {modSrc && (
                        <Grid>
                            <h5>Processed Image</h5>
                            <img src={modSrc} width={200} />
                            {modFile && (<ImagePro file={modFile} />)}
                        </Grid>
                    )}
                </Grid>
                <Grid container direction="row">
                    <Button variant="contained" color="primary" onClick={compressImage}>
                        Compress
                        </Button>
                    {modSrc && (<><Button variant="contained" color="primary" onClick={reCompressImage}>
                        Achieve Further Compression
                    </Button>
                        <a href={modSrc} download={`${file.fileName}-mod.${file.extension}`}>
                            <Button variant="outlined" color="secondary" >
                                Download
                    </Button>
                        </a>
                    </>)}
                </Grid>
            </div>
        </Container >
    )
}
