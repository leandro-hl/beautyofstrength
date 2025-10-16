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
import {Button, Grid, Icon, Input, List, Modal, Segment} from "semantic-ui-react";
import {AppContext, showError} from "../context";
import {Chip} from "./Chip";

export class ModalExerciseCreate extends Component {
    static contextType = AppContext

    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            equipment: [],
            selectedEquipment: []
        }
    }

    componentDidMount() {
        const {state: {equipment}} = this.context
        this.setState({equipment: equipment.map(e => ({...e}))})
    }

    selectEquipment(e) {
        const {selectedEquipment, equipment} = this.state
        const alreadySelected = selectedEquipment.findIndex(s => s.id === e.id)
        if (alreadySelected !== -1) {
            if(selectedEquipment[alreadySelected].occurrences < 2) {
                selectedEquipment[alreadySelected].occurrences++
            } else {
                //this.context.dispatch(showError('', 'No podes agregar mas de 2 veces el mismo equipo'))
            }
        } else {
            selectedEquipment.push({...e, occurrences: 1})
        }
        const equipmentIndex = equipment.findIndex(s => s.id === e.id)
        equipment[equipmentIndex].selected=true
        this.setState({selectedEquipment, equipment})
    }

    removeSelectedEquipment(e) {
        const {selectedEquipment, equipment} = this.state
        const i = selectedEquipment.findIndex(s => s.id === e.id)
        const equipmentIndex = equipment.findIndex(s => s.id === e.id)
        selectedEquipment.splice(i, 1)
        equipment[equipmentIndex].selected=false
        this.setState({selectedEquipment, equipment})
    }

    render() {
        const {name, equipment, selectedEquipment} = this.state
        return (
            <Modal
                open={this.props.open}
                size={"tiny"}
                dimmer={'blurring'}
            >
                <Modal.Header>
                    <Grid>
                        <Grid.Column>
                            <Grid.Row style={{marginBottom: '1rem'}}>
                                Nuevo Ejercicio
                            </Grid.Row>
                            <Grid.Row style={{marginBottom: '0.5rem'}}>
                                <Input fluid placeholder='Nombre' value={name} onChange={(e, {value}) => this.setState({name: value})} />
                            </Grid.Row>
                            <Grid.Row style={{fontSize: 14}}>
                                {selectedEquipment.length === 0 && <Chip feel>Sin equipamiento</Chip>}
                                {selectedEquipment.map(e => (
                                    <Chip feel>
                                        x{e.occurrences} {e.name}
                                        <Icon name={'close'} onClick={() => this.removeSelectedEquipment(e)}/>
                                    </Chip>
                                ))}
                            </Grid.Row>
                        </Grid.Column>
                    </Grid>
                </Modal.Header>
                <Modal.Content scrolling>
                    <List horizontal>
                        {equipment.map(e => (<List.Item
                            onClick={() => this.selectEquipment(e)}
                            style={{marginLeft:0, marginRight: '0.2em'}}
                            key={e.id}>
                            <Segment color={e.selected? 'green' : null}>
                                {e.name}
                            </Segment>
                        </List.Item>))}
                    </List>
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={() => this.props.handleClose()}>Cancelar</Button>
                    <Button primary onClick={() => this.props.handleConfirm(name, selectedEquipment)}>Crear</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}