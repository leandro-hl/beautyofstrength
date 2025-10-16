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

export class ModalRoutineActionatedConfirmation extends Component {
    state = { showModal: false }

    componentDidMount() {
        const {info: {actionatedRoutineAction}} = this.props;
        if (actionatedRoutineAction === 'skip') {
            this.setState({
                showModal: true,
                title: 'Marcar Rutina Como Omitida',
                description: 'Al omitir una rutina confirmas que no tuviste la oportunidad de entrenar. No te preocupes, lo importante es seguir avanzando!'});
        } else if (actionatedRoutineAction === 'finished') {
            this.setState({
                showModal: true,
                title: 'Marcar Rutina Como Completada',
                description: 'Al completar una rutina podras ver tus resultados en la pagina de estadisticas. Segui Asi!'});
        }
    }

    async handleConfirm() {
        const {info} = this.props;
        this.props.onConfirm(info)
        this.handleClose();
    }

    handleClose = () => {
        this.props.onClose()
    }

    render() {
        const {title, description} = this.state;
        return (
            <Modal dimmer={'blurring'} size="mini" open={this.state.showModal} onClose={() => this.handleClose()}>
                <Modal.Header>{title}</Modal.Header>
                <Modal.Content>
                    <p>{description}</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={() => this.handleClose()}>Cancelar</Button>
                    <Button primary onClick={() => this.handleConfirm()}>Confirmar</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}