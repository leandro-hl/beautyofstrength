import {Component, useRef, useState} from "react";
import {Container, Grid} from "@mui/material";
import {ReactComponent as UploadFileIcon} from "../icons/upload-file.svg";

export function ImageUpload({onFileSelected}) {
    const [loading, setLoading] = useState(false)
    const inputRef = useRef(null)

    const onFileChange = async event => {
        setLoading(true)

        await onFileSelected(event.target.files[0])
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        setLoading(false)
    };

    return (
        <>
            <Container
                sx={{
                    borderRadius: '4.875px',
                    border: 'dashed #8080803d',
                    marginBottom: '1rem',
                    padding: '1rem',
                }}
                loading={loading}
                onClick={() => inputRef.current.click()}>
                <Grid container direction={'column'} alignItems={'center'}>
                    <UploadFileIcon style={{height:60}}/>
                    <h5>Usar Mi Propia Portada de Rutina</h5>
                    <span>jpg o jpeg - ratio 1:1 (cuadrada)</span>
                </Grid>
            </Container>
            <input ref={inputRef} type="file" onChange={onFileChange} hidden accept="image/jpeg"/>
        </>)
}