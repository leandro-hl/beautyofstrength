import React, {Component} from "react";
import {Button, Modal} from "semantic-ui-react";
import {AppContext, setData} from "../context";

class ModalExerciseVideo extends Component {
    static contextType = AppContext

    handleClose = () => {
        this.context.dispatch(setData({videoCode: null}))
    }

    render() {
        const {state: {videoCode}} = this.context
        return (
            <Modal
                className={'embeded-video'}
                closeIcon
                closeOnEscape={true}
                closeOnDimmerClick={true}
                centered={false}
                dimmer={'blurring'}
                open={!!videoCode}
                onClose={() => this.handleClose()}>
                <Modal.Content className={'no-padding'} style={{height: 545}}>
                    <iframe style={{border: 'unset'}} width="100%" height="545"
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