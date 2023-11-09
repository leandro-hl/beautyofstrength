import React, {Component} from "react";
import {Button, Modal} from "semantic-ui-react";
import {saveUserTrainedToday} from "../service";

export class ModalPlanificationRequestAccess extends Component {
    state = { showModal: false }

    componentDidMount() {
        this.setState({ showModal: true });
    }

    async handleConfirm() {
        this.props.onRequestAccess()
        this.handleClose();
    }

    handleClose = () => {
        this.setState({ showModal: false });
    }

    render() {
        return (
            <Modal dimmer={'blurring'} size="mini" open={this.state.showModal} onClose={() => this.handleClose()}>
                <Modal.Header>Compartieron una planificacion con vos!</Modal.Header>
                <Modal.Content>
                    <p>Solicita acceso a la planificacion haciendo click en el boton de Solicitar.</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={() => this.handleClose()}>Cancelar</Button>
                    <Button primary onClick={() => this.handleConfirm()}>Solicitar Acceso</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}