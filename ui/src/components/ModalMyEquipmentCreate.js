import React, {Component} from "react";
import {Button, Dropdown, Grid, Header, Icon, Input, List, Message, Modal, Segment} from "semantic-ui-react";
import {AppContext, showError} from "../context";
import {Chip} from "./Chip";

export class ModalMyEquipmentCreate extends Component {
    static contextType = AppContext

    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
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
                    <Button secondary onClick={() => this.props.handleClose()}>Cancelar</Button>
                    <Button primary onClick={() => this.props.handleConfirm(this.state)}>Crear</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}