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

export class SegMinButtonGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {minIsPrimary: props.default === 'min'}
    }
    selected(interval) {
        this.setState({minIsPrimary: interval === 'min'})
        this.props.onIntervalSelected(interval)
    }
    render() {
        const {minIsPrimary} = this.state
        return (
            <Button.Group>
                <Button primary={!minIsPrimary} secondary={minIsPrimary} onClick={() => this.selected('sec')}>Seg</Button>
                {/*<Button secondary={!minIsPrimary} primary={minIsPrimary} onClick={() => this.selected('min')}>Min</Button>*/}
            </Button.Group>
        )
    }
}