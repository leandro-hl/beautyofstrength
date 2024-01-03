import React, {Component} from "react";
import {Button, Modal} from "semantic-ui-react";
import {saveUserTrainedToday} from "../service";

export class ModalInstructorInviteAccept extends Component {
    state = { showModal: false }

    componentDidMount() {
        this.setState({ showModal: true });
    }

    async handleConfirm() {
        this.props.onRequestAccess()
        this.handleClose();
    }

    handleClose = () => {
        this.props.onCancelRequest()
        this.setState({ showModal: false });
    }

    render() {
        return (
            <Modal dimmer={'blurring'} size="mini" open={this.state.showModal} onClose={() => this.handleClose()}>
                <Modal.Header>Tu coach te ha invitado a conectar con el!</Modal.Header>
                <Modal.Content>
                    <p>Aceptar invitacion.</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={() => this.handleClose()}>Declinar</Button>
                    <Button primary onClick={() => this.handleConfirm()}>Aceptar</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}