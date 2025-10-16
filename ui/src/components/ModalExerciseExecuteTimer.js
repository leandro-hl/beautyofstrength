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