import {Component, useRef, useState} from "react";
import {Header, Icon, IconGroup, Segment} from "semantic-ui-react";

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
            <Segment loading={loading}
                textAlign={'center'}
                onClick={() => inputRef.current.click()}>
                <Header icon as={'h5'}>
                    <Icon name='image outline' />
                    Subir Portada de Rutina
                </Header>
                <br/>
                jpg o jpeg - maximo 600kb - ratio 1:1
            </Segment>
            <input ref={inputRef} type="file" onChange={onFileChange} hidden accept="image/jpeg" />
        </>)
}