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
