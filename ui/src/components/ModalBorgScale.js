import React, {Component} from "react";
import {Button, Input, Message, Modal, Segment} from "semantic-ui-react";

export class ModalBorgScale extends Component {
    constructor(props) {
        super(props);

        this.state = {scale:[
                {raisedColor: 'rgb(1,138,100)' ,color: '#00ffb5', name: 'Reposo'},
                {raisedColor: '#007a56' ,color: '#00ffb5', name: 'Muy, Muy Ligero'},
                {raisedColor: '#007050' ,color: '#00ffb5', name: 'Muy Ligero'},
                {raisedColor: '#1c8100' ,color: '#36ff00', name: 'Ligero'},
                {raisedColor: '#196e00' ,color: '#36ff00', name: 'Algo pesado'},
                {raisedColor: '#726b00' ,color: '#fff000', name: 'Pesado'},
                {raisedColor: '#817b00' ,color: '#fff000', name: 'Mas Pesado'},
                {raisedColor: '#773400' ,color: '#ff7000', name: 'Muy Pesado'},
                {raisedColor: '#863c00' ,color: '#ff7000', name: 'Muy, Muy Pesado'},
                {raisedColor: '#750b00' ,color: '#ff1800', name: 'Maximo'},
                {raisedColor: '#960e00' ,color: '#ff1800', name: 'Extremo'},
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
                            style={{backgroundColor: this.state.selected===i ? s.raisedColor : s.color, color: '#000000'}}
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