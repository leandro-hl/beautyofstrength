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