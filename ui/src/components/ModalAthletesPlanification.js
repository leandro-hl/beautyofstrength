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