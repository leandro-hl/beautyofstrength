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