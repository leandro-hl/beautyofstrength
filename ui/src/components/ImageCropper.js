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

import React, {useState, createRef, Component} from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import {Button, Grid, Segment} from "semantic-ui-react";

export class ImageCropper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file: props.toCrop,
            cropData: "#",
            cropperRef: React.createRef()
        }
    }

    componentDidMount() {
        const reader = new FileReader();
        reader.onload = () => {
            this.setState({image: reader.result});
        };
        reader.readAsDataURL(this.state.file);
    }

    getCropData = () => {
        if (typeof this.state.cropperRef.current?.cropper !== "undefined") {
            this.state.cropperRef.current?.cropper.getCroppedCanvas().toBlob((blob) => {
                this.setState({uploading:true})
                this.props.onConfirm(blob)
            });
        }
    };

    render() {
        const {uploading} = this.state
        return (
            <Grid className={'margin-bottom-1'}>
                <Grid.Row className={'no-padding'}>
                    <Segment basic={true} className={'no-padding'} loading={uploading}>
                        <Cropper
                            ref={this.state.cropperRef}
                            style={{minWidth: "100%", maxHeight:0, paddingBottom: '100%'}}
                            zoomTo={0.5}
                            // zoomable={false}
                            aspectRatio={1}
                            // initialAspectRatio={1}
                            // preview=".img-preview"
                            src={this.state.image}
                            viewMode={1}
                            minCropBoxHeight={10}
                            minCropBoxWidth={10}
                            background={false}
                            responsive={true}
                            autoCropArea={1}
                            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                            guides={true}
                        />
                    </Segment>
                </Grid.Row>
                <Grid.Row className={'center-content no-padding'} columns={2}>
                    <Grid.Column className={'center-content no-padding'}>
                        <Button secondary onClick={() => this.props.onCancel()} style={{width: '100%'}}>
                            Cancelar
                        </Button>
                    </Grid.Column>
                    <Grid.Column className={'center-content no-padding'}>
                        <Button primary={true} onClick={() => this.getCropData()} style={{width: '100%'}}>
                            Confirmar Cover
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}
