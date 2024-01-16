import React, {Component} from "react";
import {Button, Header, Icon, Input, Modal, Segment} from "semantic-ui-react";
import {Timer} from "./Timer";

export class ModalExerciseExecuteTimer extends Component {
    state = {currentDescription: 'Preparense...'}

    componentDidMount() {
    }

    onNextInterval() {
        this.setState({currentDescription: 'Tiempo'})
    }

    onFinished() {
        this.props.onFinished()
    }

    timerMounted(timer) {
        const {secs} = this.props
        timer.start([secs, 5])
        this.setState({timerRef: timer})
    }

    render() {
        const{currentDescription, finished}=this.state
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
                </Modal.Content>
            </Modal>
        )
    }
}