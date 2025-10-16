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
import {Button, Modal, Segment} from "semantic-ui-react";
import {saveUserTrainedToday} from "../service";

export class ModalTrainingBlockType extends Component {
    constructor(props) {
        super(props);

        this.state = {
            types: [
                {id: 'free', name: 'LIBRE'},
                {id: 'spr', name: 'SERIE POR REPETICIONES'},
                {id: 'cpt', name: 'CIRCUITO POR INTERVALOS'},
                {id: 'amrap', name: 'AMRAP'},
                {id: 'cbo', name: 'COMBO'},
                {id: 'pir', name: 'PIRAMIDE REPETICIONES'},
                {id: 'emom', name: 'EMOM'},
                {id: 'hiit', name: 'HIIT'},
                {id: 'drop', name: 'DROP SET'},
            ]
        }
    }

    componentDidMount() {
        // this.setState({ showModal: true });
    }

    handleClose = () => {
        this.props.onClose()
    }

    selectBlockType(p) {
        this.props.onTypeSelected(p.id, p.name)
    }

    render() {
        const {types} = this.state;
        const disabled = (p) => (p.id !== 'cpt' && p.id !== 'amrap' && p.id !== 'cbo' && p.id !== 'pir' && p.id !== 'free' && p.id !== 'spr')
        return (
            <Modal dimmer={'blurring'} size="mini" open={this.props.showModal} onClose={() => this.handleClose()}>
                <Modal.Header>Elegi el tipo de trabajo</Modal.Header>
                <Modal.Content>
                    {types.map(p => (<Segment
                        disabled={disabled(p)}
                        style={{width: '100%'}}
                        key={p.id}
                        onClick={() => this.selectBlockType(p)}>{p.name + (disabled(p) ? ' - Proximamente' : '')}
                    </Segment>))}
                </Modal.Content>
            </Modal>
        )
    }
}