import React, {Component} from "react";
import {Button, Input, Modal} from "semantic-ui-react";

export class ModalInitialEnergyLevel extends Component {
    render() {
        return (
            <Modal
                open={this.props.open}
                size={"tiny"}
            >
                <Modal.Header>
                    Nueva Planificacion
                </Modal.Header>
                <Modal.Content>
                    <Input fluid placeholder='Nombre' onChange={(e, {value}) => this.props.onNewPlanificationName(value)} />
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={() => this.props.handleClose()}>Cancelar</Button>
                    <Button primary onClick={() => this.props.handleConfirm()}>Crear</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}