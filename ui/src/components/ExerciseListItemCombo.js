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
import {Button, Grid, Icon, Input, Label, List} from "semantic-ui-react";

export class ExerciseListItemCombo extends Component {
    constructor(props) {
        super(props);
        this.state = {value: null}
    }

    render() {
        return (
            <List.Item key={this.props.item.key}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column stretched>
                            <Label basic style={{padding: 20}} className={this.props.selected ? 'mine-selected' : ''}>
                                <Grid.Row>
                                    <Icon name="chevron up" className={'chevron-up'} onClick={() => this.props.moveUp()}/>
                                    <Icon name="chevron down" className={'chevron-down'} onClick={() => this.props.moveDown()}/>
                                    {this.props.item.text}
                                    <Icon name={'sync'} className={'list-item-icon'} onClick={() => this.props.onRepeat(this.props.item)}/>
                                </Grid.Row>
                                <Grid.Row>
                                    {/*<span style={{fontSize: '0.6em'}}>agregado por: {this.props.item.createdbyuser}</span>*/}
                                </Grid.Row>
                            </Label>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </List.Item>
        )
    }
}