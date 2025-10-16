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
import {Button} from "semantic-ui-react";
import {Chip} from "./Chip";

export class SegRepsButtonGroup extends Component {
    selected(interval) {
        if(this.props.onIntervalSelected) {
            this.props.onIntervalSelected(interval)
        }
    }
    render() {
        const repsIsPrimary = this.props.default === 'reps'
        return (
            <Button.Group vertical style={{justifyContent: 'center'}}>
                <Button style={{flex: 'unset'}} as={Chip} basic={!repsIsPrimary} secondary={!repsIsPrimary} primary={repsIsPrimary} onClick={() => this.selected('reps')}>Rep</Button>
                <Button style={{flex: 'unset'}} as={Chip} basic={repsIsPrimary} secondary={repsIsPrimary} primary={!repsIsPrimary} onClick={() => this.selected('secs')}>Seg</Button>
            </Button.Group>
        )
    }
}