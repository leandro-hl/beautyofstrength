import React, {Component} from "react";
import {Button, Header, Icon, Input, Modal, Segment} from "semantic-ui-react";
import {Timer} from "./Timer";

export class ModalExerciseExecuteTimer extends Component {
    state = {
        currentDescription: 'Preparense...',
        nextDescription: '',
        executed:1
    }

    componentDidMount() {
        const {queue} = this.props
        if (queue) {
            const {executed}=this.state
            this.setState({
                nextDescription: queue[queue.length-executed].e.name
            })
        }
    }

    onNextInterval() {
        const {queue} = this.props
        if (queue) {
            const {executed}=this.state
            this.setState({
                currentDescription: queue[queue.length-executed].e.name,
                nextDescription: queue[queue.length-executed-1].e.name,
                executed: executed+1})
        } else {
            this.setState({
                currentDescription: 'Tiempo'})
        }
    }

    onFinished() {
        this.props.onFinished()
    }

    timerMounted(timer) {
        const {queue, secs} = this.props

        if (queue) {
            const arr = queue.map(i => i.e.secs)
            timer.start([...arr, 5])
        } else {
            timer.start([secs, 5])
        }

        this.setState({timerRef: timer})
    }

    render() {
        const{currentDescription, nextDescription, finished}=this.state
        const {name} = this.props
        return (
            <Modal
                open={!finished}
                closeIcon
                closeOnEscape={true}
                closeOnDimmerClick={true}
                dimmer={'blurring'}
                onClose={() => this.onFinished()}
            >
                <Modal.Header>
                    {name}
                </Modal.Header>
                <Modal.Content style={{textAlign:'center'}}>
                    <Header className={'no-margin'} as={'h2'}>{currentDescription}</Header>
                    <Segment textAlign={'center'} style={{borderRadius:100}}>
                        <Header className={'no-margin'} as={'h1'}>
                            <Timer
                                onNextInterval={() => this.onNextInterval()}
                                onFinished={() => this.onFinished()}
                                onMounted={(timer) => this.timerMounted(timer)}
                            />
                        </Header>
                    </Segment>
                    <Header className={'no-margin'} as={'h2'}>{nextDescription}</Header>
                </Modal.Content>
            </Modal>
        )
    }
}