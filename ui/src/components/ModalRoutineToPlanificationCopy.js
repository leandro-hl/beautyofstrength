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
import {Button, Dropdown, Input, Modal} from "semantic-ui-react";
import {listPlanifications} from "../service";
import {AppContext, setData} from "../context";

export class ModalRoutineToPlanificationCopy extends Component {
    static contextType = AppContext
    state = {}
    async componentDidMount() {
        try {
            const {state: {myPlanifications}} = this.context

            const options = myPlanifications
                .filter(p => p.name !== "Rutinas Compartidas")
                .map(e => ({key: e.id, value: e.id, text: e.name}));

            if (myPlanifications) {
                this.setState({loading: false, options: options})
            } else {
                const res = await listPlanifications();
                const ownedPlanifications = res.data.filter(p => p.owner);
                this.setState({loading: false, options: options})
                this.context.dispatch(setData({myPlanifications: ownedPlanifications}, true))
            }
        } catch (e) {
            console.error(e)
        }
    }

    handleSelection = (e, { value }) => this.setState({selectedPlanification: value })

    handleClose() {
        this.props.handleClose()
        this.setState({selectedPlanification: null})
    }

    handleConfirm() {
        this.props.handleConfirm(this.state.selectedPlanification)
        this.setState({selectedPlanification: null})
    }

    render() {
        const {selectedPlanification, options} = this.state
        return (
            <Modal
                open={true}
                size={"tiny"}
                dimmer={'blurring'}
            >
                <Modal.Header>
                    Copiar a Planificacion
                </Modal.Header>
                <Modal.Content>
                    <Dropdown
                        placeholder={'Planificacion'}
                        fluid
                        search
                        selection
                        options={options}
                        value={selectedPlanification}
                        onChange={this.handleSelection}
                        openOnFocus={true}
                        tabIndex={0}
                        noResultsMessage={'No se encontro la planificacion'}
                        selectOnBlur={false}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={() => this.handleClose()}>Cancelar</Button>
                    <Button primary onClick={() => this.handleConfirm()}>Copiar</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}