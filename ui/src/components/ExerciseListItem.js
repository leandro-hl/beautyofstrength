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

import React, {Component, createRef} from "react";
import {Grid, Icon, Input, Label, List} from "semantic-ui-react";

export class ExerciseListItem extends Component {
    inputRef = createRef()

    constructor(props) {
        super(props);
        this.state = {value: null}
    }

    componentDidMount() {
        if(this.props.focus) {
            this.inputRef.current.focus()
        }
    }

    handleChange(value) {
        this.setState({value: value})
        this.props.finished(value)
    }

    handleKeyDown(event) {
        if (event.key === 'Enter') {
            const {value} = this.state;
            this.props.finished(value)
        }
    };

    render() {
        if(this.props.focus && this.inputRef.current) {
            this.inputRef.current.focus()
        }
        return (
            <List.Item key={this.props.item.key}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={12} stretched style={{paddingRight: 0}}>
                            <Label basic style={{width: '100%', padding: 20}}>
                                {this.props.item.text}
                                { this.props.onRepeat && <Icon name={'sync'} className={'list-item-icon-input'}
                                       onClick={() => this.props.onRepeat(this.props.item)}/>
                                }
                            </Label>
                        </Grid.Column>
                        <Grid.Column width={4} stretched style={{paddingLeft: 0}}>
                            <Input fluid
                                   ref={this.inputRef} placeholder='10' type={'number'}
                                   min={1}
                                   max={99}
                                   value={this.props.value}
                                   onKeyDown={(event) => this.handleKeyDown(event)}
                                   onChange={(e, {value}) => this.handleChange(value)}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </List.Item>
        )
    }
}