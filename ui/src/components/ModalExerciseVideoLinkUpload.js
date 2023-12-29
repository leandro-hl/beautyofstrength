import React, {Component} from "react";
import {Button, Input, Message, Modal} from "semantic-ui-react";

export class ModalExerciseVideoLinkUpload extends Component {
    state = {}
    handleClose(){
        this.props.handleClose()
        this.setState({link: null})
    }

    handleConfirm(){
        if (this.state.link) {
            this.props.handleConfirm(this.state.link)
            this.setState({link: null})
        }
    }

    render() {
        const {open, item}= this.props
        return (
            <Modal
                open={open}
                size={"tiny"}
            >
                <Modal.Header>
                    Subir link de video para {item?.name}
                </Modal.Header>
                <Modal.Content>
                    <Message>
                        <Message.Header>Tener en cuenta</Message.Header>
                        <Message.List>
                            <Message.Item>La relacion esperada es 9:16 (Ejemplo Reel/Short)</Message.Item>
                            <Message.Item>El titulo del video debe tener el formato "[TU_NOMBRE] - [NOMBRE_EJERCICIO]" para brindar una mejor experiencia a tus atletas.</Message.Item>
                            <Message.Item>Solo links a Shorts de You Tube</Message.Item>
                        </Message.List>
                    </Message>
                    <Input fluid placeholder='Link' onChange={(e, {value}) => this.setState({link: value})} />
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={() => this.handleClose()}>Cancelar</Button>
                    <Button primary onClick={() => this.handleConfirm()}>Subir</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}