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
                <Modal.Header>Elegi el tipo de bloque</Modal.Header>
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