/**
 * Copyright 2025 Leandro Herenu - BOS (Beauty Of Strength)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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