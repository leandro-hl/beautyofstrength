import React, {Component} from "react";
import {Button, Modal, Segment} from "semantic-ui-react";
import {saveUserTrainedToday} from "../service";

export class ModalTrainingBlockType extends Component {
    constructor(props) {
        super(props);

        this.state = {
            types: [
                {id: 'cpt', name: 'CIRCUITO POR INTERVALOS'},
                //to do. SEPARACION MUJERES Y HOMBRES / AVANZADOS, INTERMEDIOS E INICIANTES.
                //hay ejercicios con peso y otros sin peso. Ejercicios con equipamiento y otro sin.
                //Muchas veces esto esta en la esencia del ejercicio por lo que no tiene sentido, por ejemplo, que tengas la opcion de elegir el peso
                //para todos los ejercicios. ...
                {id: 'amrap', name: 'AMRAP'}, //recomiendan entre 10 y 20min de laburo...
                {id: 'hiit', name: 'HIIT'},
                {id: 'emom', name: 'EMOM'},
                {id: 'cbo', name: 'COMBOS'},
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
        return (
            <Modal dimmer={'blurring'} size="mini" open={this.props.showModal} onClose={() => this.handleClose()}>
                <Modal.Header>Elegi el tipo de bloque</Modal.Header>
                <Modal.Content>
                    {types.map(p => (<Segment
                        disabled={p.id !== 'cpt'}
                        style={{width: '100%'}}
                        key={p.id}
                        onClick={() => this.selectBlockType(p)}>{p.name + (p.id !== 'cpt' ? ' - Proximamente' : '')}
                    </Segment>))}
                </Modal.Content>
            </Modal>
        )
    }
}