import React, {useState, createRef, Component} from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

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
                this.props.onConfirm(blob)
            });
        }
    };

    render() {
        return (
            <div>
                <div style={{width: "100%"}}>
                    <Cropper
                        ref={this.state.cropperRef}
                        style={{height: 500, width: "100%"}}
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
                </div>
                <div>
                    <div
                        className="box"
                        style={{width: "50%", float: "right", height: "300px"}}
                    >
                        <h1>
                            <span>Crop</span>
                            <button onClick={() => this.getCropData()}>
                                Crop Image
                            </button>
                        </h1>
                    </div>
                </div>
            </div>
        )
    }
}
