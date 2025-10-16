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
import {Chip} from "./Chip";

export class ModalRMAdd extends Component {
    state = {}
    render() {
        const {open, name, onClose, onConfirm, onChange} = this.props
        const today = new Date()
        const date = `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`
        return (
            <Modal
                open={open}
                size={"mini"}
                dimmer={'blurring'}
            >
                <Modal.Header>
                    Nuevo RM: <Chip style={{fontSize: 14}} feel>{date}</Chip>
                </Modal.Header>
                <Modal.Content>
                    <div className={'align-center'}>{name}</div>
                    <Input
                        className={'align-center'}
                        label={{ basic: true, content: 'Kgs' }}
                        labelPosition='right'
                        type={'number'} fluid placeholder={'110'} onChange={(e, {value}) => this.setState({value})} />
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={() => onClose()}>Cancelar</Button>
                    <Button primary onClick={() => onConfirm(this.state.value)}>Crear</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}