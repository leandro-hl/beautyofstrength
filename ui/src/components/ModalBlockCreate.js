import React, {Component} from "react";
import {Button, Input, Modal} from "semantic-ui-react";

export class ModalBlockCreate extends Component {
    render() {
        return (
            <Modal
                open={this.props.open}
                size={"tiny"}
            >
                <Modal.Header>
                    Nuevo Bloque
                </Modal.Header>
                <Modal.Content>
                    <Input fluid placeholder={'Bloque '+this.props.next} onChange={(e, {value}) => this.props.onChange(value)} />
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={() => this.props.onClose()}>Cancelar</Button>
                    <Button primary onClick={() => this.props.onConfirm()}>Crear</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}