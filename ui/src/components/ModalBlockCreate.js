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