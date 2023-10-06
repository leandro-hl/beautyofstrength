import React, {Component} from "react";
import {Button, Modal} from "semantic-ui-react";
import {saveUserTrainedToday} from "../service";

export class ModalHaveTrained extends Component {
    state = { showModal: false }

    componentDidMount() {
        this.setState({ showModal: true });
    }

    async handleConfirm(answer) {
        await saveUserTrainedToday({answer})
        this.handleClose();
    }

    handleClose = () => {
        this.setState({ showModal: false });
    }

    render() {
        return (
            <Modal dimmer={'blurring'} size="mini" open={this.state.showModal} onClose={() => this.handleClose()}>
                <Modal.Header>Contanos si entrenaste hoy</Modal.Header>
                <Modal.Content>
                    <p>Mantene tu calendario actualizado para tener una mejor progresion.</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={() => this.handleConfirm(false)}>No</Button>
                    <Button primary onClick={() => this.handleConfirm(true)}>Si</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}