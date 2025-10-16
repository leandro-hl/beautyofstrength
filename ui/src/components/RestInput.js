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
import {Input, Label} from "semantic-ui-react";
import {SegMinButtonGroup} from "./SegMinButtonGroup";

export class RestInput extends Component {
    render() {
        const {type} = this.props;
        return (
            <Input type='number' className={'align-center'} fluid placeholder='30' max={300} min={0} action onChange={(e, {value}) => this.props.onChange(type, {amount: value})}>
                <Label>
                    {type === 'lapRest' ? <span>Descanso Ronda&nbsp;&nbsp;&nbsp;&nbsp;</span> : <span>Descanso Ejercicio</span>}
                </Label>
                <input />
                <SegMinButtonGroup default={this.props.default} onIntervalSelected={(i) => this.props.onChange(type, {interval: i})}/>
            </Input>
        )
    }
}