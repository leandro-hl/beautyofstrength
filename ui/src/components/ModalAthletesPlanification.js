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

export class ModalAthletesPlanification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            types: [
                {id: 1, name: 'Juan Cruz'},
                {id: 2, name: 'Lucas Serio'},
                {id: 3, name: 'Ramon Castillo'},
            ]
        }
    }

    componentDidMount() {
        // this.setState({ showModal: true });
    }

    handleClose = () => {
        this.props.onClose()
    }

    selectAthlete(p) {
        //show athlete stats.
    }

    render() {
        const {types} = this.state;
        return (
            <Modal dimmer={'blurring'} size="mini" open={this.props.showModal} onClose={() => this.handleClose()}>
                <Modal.Header>Elegi el tipo de trabajo</Modal.Header>
                <Modal.Content>
                    {types.map(p => (<Segment
                        style={{width: '100%'}}
                        key={p.id}
                        onClick={() => this.selectAthlete(p)}>
                        {p.name}
                    </Segment>))}
                </Modal.Content>
            </Modal>
        )
    }
}