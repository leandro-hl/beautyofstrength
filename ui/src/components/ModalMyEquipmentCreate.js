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
import {Button, Dropdown, Grid, Header, Icon, Input, List, Message, Modal, Segment} from "semantic-ui-react";
import {AppContext, showError} from "../context";
import {Chip} from "./Chip";

export class ModalMyEquipmentCreate extends Component {
    static contextType = AppContext

    constructor(props) {
        super(props);

        this.state = {
            equipment: [],
            selectedEquipment: null
        }
    }

    componentDidMount() {
        const {state: {equipment}} = this.context
        this.setState({equipment: equipment.map(e => ({key: e.id, value: e.id, text: e.name}))})
    }

    handleEquipmentSelection = (e, { value }) => this.setState({selectedEquipment: value })

    render() {
        const {equipment, selectedEquipment} = this.state
        return (
            <Modal
                open={this.props.open}
                size={"tiny"}
                dimmer={'blurring'}
            >
                <Modal.Header>
                    Agregar Equipamiento
                </Modal.Header>
                <Modal.Content>
                    <p className={'margin-bottom-1'}>Equipo:</p>
                    <Dropdown
                        className={'margin-bottom-1'}
                        scrolling
                        placeholder={'Nombre'}
                        fluid
                        selection
                        options={equipment}
                        value={selectedEquipment}
                        onChange={this.handleEquipmentSelection}
                        openOnFocus={true}
                        tabIndex={0}
                        selectOnBlur={false}
                    />
                    <Input fluid
                            onChange={(e, {value, name}) => this.setState({[name]: value})}
                           name={'units'}
                           placeholder={'Unidades'}
                           className={'margin-bottom-1'}
                           type={'number'}/>
                    <p>Opcionales acuerdo al equipo:</p>
                    <Input fluid
                            onChange={(e, {value, name}) => this.setState({[name]: value})}
                           name={'weight'}
                           placeholder={'Peso (kgs)'}
                           className={'margin-bottom-half'}
                           type={'number'}/>
                    <Input fluid
                            onChange={(e, {value, name}) => this.setState({[name]: value})}
                           name={'height'}
                           placeholder={'Alto (cms)'}
                           className={'margin-bottom-half'}
                           type={'number'}/>
                    <Input fluid
                            onChange={(e, {value, name}) => this.setState({[name]: value})}
                           name={'width'}
                           placeholder={'Ancho (cms)'}
                           className={'margin-bottom-half'}
                           type={'number'}/>
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={() => this.handleClose()}>Cancelar</Button>
                    <Button primary onClick={() => this.handleConfirm()}>Crear</Button>
                </Modal.Actions>
            </Modal>
        )
    }
    handleClose() {
        this.props.handleClose()
        this.setState({selectedEquipment: null})
    }
    handleConfirm() {
        this.props.handleConfirm(this.state)
        this.setState({selectedEquipment: null})
    }
}