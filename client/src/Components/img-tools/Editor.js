import React, { useState } from 'react'
import FilerobotImageEditor from 'filerobot-image-editor';
import Grid from '@material-ui/core/Grid'
import axios from 'axios'
import Button from '@material-ui/core/Button'
import ImagePro from '../UI/ImagePro';

export default function Editor() {
    const [open, setopen] = useState(false)
    const [imgSrc, setimgSrc] = useState(null)
    const [file, setfile] = useState(null)
    const [fileName, setfileName] = useState(null)
    const config = {
        tools: ['adjust', 'effects', 'filters', 'rotate', 'crop', 'resize', 'watermark'],
    }
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
                    setfile(res.data.file)
                    setfileName(res.data.file.fileName)
                }
            })
            .catch(err => console.log(err))
    };
    return (
        <div>
            <h1>Image Editor</h1>
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
            </Grid>
            <Button variant="contained" color="primary" onClick={() => setopen(true)}>
                Edit Image
            </Button>
            <FilerobotImageEditor
                show={open}
                src={imgSrc}
                onClose={() => setopen(false)}
                config={config}
            />
        </div>
    )
}
