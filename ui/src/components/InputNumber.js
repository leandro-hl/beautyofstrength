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

export class InputNumber extends Component {
    render() {
        const {seconds, minutes, placeHolder} = this.props;
        const ph = placeHolder? placeHolder : seconds ? '30"' : minutes ? "15'" : "4"
        return (
            <Input
                label={this.props.label ? <Label basic attached='top left'>{this.props.label}</Label> : null}
                type='number'
                   className={`align-center input-left-label ${this.props.large ? 'input-large' : ''}`}
                   fluid placeholder={ph}
                   max={300} min={0} action
                   onChange={(e, {value}) => this.props.onChange({amount: value})}/>
        )
    }
}