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

import {Component} from "react";
import {IconButton, Tooltip} from "@mui/material";
import {ReactComponent as InfoIcon} from '../../icons/info.svg'

export class TooltipInfoButton extends Component {
    state = {
        showTooltip: false
    }
    render() {
        const {showTooltip} = this.state;
        return (
            <>
                <Tooltip
                    leaveTouchDelay={5000}
                    placement="top"
                    open={showTooltip}
                    onClose={() => this.setState({showTooltip: false})}
                    arrow
                    title={this.props.title}
                    {...this.props}>
                    <IconButton aria-label="info" onClick={() => this.setState({showTooltip: true})}>
                        {this.props.icon ? this.props.icon : <InfoIcon/>}
                    </IconButton>
                </Tooltip>
            </>
        )
    }

}