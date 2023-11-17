import React, {Component} from "react";
import {Button, Modal} from "semantic-ui-react";
import {AppContext, setData} from "../context";

class ModalExerciseVideo extends Component {
    static contextType = AppContext

    constructor(props) {
        super(props);
        this.calculateDimensions()
    }

    calculateDimensions() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const aspectRatio = 16 / 9;
        // Calculate width and height based on the screen size and aspect ratio
        let videoWidth = screenWidth * 0.95; // Start with the full width
        let videoHeight = videoWidth * aspectRatio;

        // Check if the calculated height is greater than the screen height
        if (videoHeight > screenHeight) {
            // If yes, recalculate both based on the screen height
            videoHeight = screenHeight;
            videoWidth = videoHeight / aspectRatio;
        }

        this.state = { width: videoWidth, height: videoHeight };
    }

    handleClose = () => {
        this.context.dispatch(setData({videoCode: null}))
    }

    render() {
        const {state: {videoCode}} = this.context
        const {width, height} = this.state
        return (
            <Modal
                className={'embeded-video no-padding'}
                closeIcon
                closeOnEscape={true}
                closeOnDimmerClick={true}
                centered={false}
                dimmer={'blurring'}
                open={!!videoCode}
                onClose={() => this.handleClose()}>
                <Modal.Content className={'no-padding'} style={{height: height}}>
                    <iframe style={{border: 'unset'}} width="100%" height={height}
                            src={"https://www.youtube.com/embed/"+videoCode}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen>
                    </iframe>
                </Modal.Content>
            </Modal>
        )
    }
}

export default ModalExerciseVideo