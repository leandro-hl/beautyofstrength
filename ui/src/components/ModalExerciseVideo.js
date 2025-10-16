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
                            src={videoCode}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen>
                    </iframe>
                </Modal.Content>
            </Modal>
        )
    }
}

export default ModalExerciseVideo