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