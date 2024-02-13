import React, {Component} from "react";
import {Button, Input, Message, Modal, Segment} from "semantic-ui-react";

export class ModalBorgScale extends Component {
    constructor(props) {
        super(props);

        this.state = {scale:[
                {color: '#00ffb5', name: 'Reposo'},
                {color: '#00ffb5', name: 'Muy, Muy Ligero'},
                {color: '#00ffb5', name: 'Muy Ligero'},
                {color: '#36ff00', name: 'Ligero'},
                {color: '#36ff00', name: 'Algo pesado'},
                {color: '#fff000', name: 'Pesado'},
                {color: '#fff000', name: 'Mas Pesado'},
                {color: '#ff7000', name: 'Muy Pesado'},
                {color: '#ff7000', name: 'Muy, Muy Pesado'},
                {color: '#ff1800', name: 'Maximo'},
                {color: '#ff1800', name: 'Extremo'},
            ]}
    }

    handleConfirm() {
        const {selected}=this.state
        if(selected !== undefined) {
            this.props.onConfirm(selected)
        } else {
            this.setState({showError: true})
        }
    }

    render() {
        return (
            <Modal
                open={true}
                closeIcon
                dimmer={'blurring'}
                onClose={() => this.props.onCancel()}
            >
                <Modal.Header>
                    Finalizar Rutina
                </Modal.Header>
                <Modal.Content scrolling>
                    <Message>
                        <Message.Content>Como fue tu experiencia?</Message.Content>
                    </Message>
                    {this.state.scale.map((s,i) => (
                        <Segment
                            raised={this.state.selected===i}
                            style={{backgroundColor: s.color}}
                            onClick={() => this.setState({selected: i, showError:false})}>
                            {s.name}
                        </Segment>
                    ))}
                </Modal.Content>
                <Modal.Actions>
                    {this.state.showError && <Message error content={'Elige un valor de la escala para continuar'}/> }
                    <Button primary onClick={() => this.handleConfirm()}>Confirmar</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}