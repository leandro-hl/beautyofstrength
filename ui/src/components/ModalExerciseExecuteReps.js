import React, {Component} from "react";
import {Button, Divider, Header, Icon, Input, Modal, Segment} from "semantic-ui-react";
import {Timer} from "./Timer";
import {InputNumber} from "./InputNumber";

export class ModalExerciseExecuteReps extends Component {
    state = {}

    componentDidMount() {
        console.log(this.props)
    }

    onFinished() {
        const {effectiveReps, kgs} = this.state
        const {reps,previousKg} = this.props
        const payload = {effectiveReps:effectiveReps??reps, kgs:kgs??previousKg}
        this.props.onFinished(payload)
    }

    onCancel() {
        this.props.onCancel()
    }

    render() {
        const {name, reps, previousKg} = this.props
        return (
            <Modal
                open={true}
                closeIcon
                closeOnEscape={true}
                closeOnDimmerClick={true}
                dimmer={'blurring'}
                onClose={() => this.onCancel()}
            >
                <Modal.Header>
                    {name}
                </Modal.Header>
                <Modal.Content style={{textAlign:'center'}}>
                    <Segment textAlign='center'>
                        <Divider horizontal>Reps Efectivas</Divider>
                        <InputNumber placeHolder={reps}
                                     large onChange={({amount}) => this.setState({effectiveReps: amount})}/>
                        <Divider horizontal>KG</Divider>
                        <InputNumber placeHolder={previousKg} large onChange={({amount}) => this.setState({kgs: amount})}/>
                    </Segment>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary onClick={() => this.onFinished()}>Continuar</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}