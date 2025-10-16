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
import {Icon, Radio} from "semantic-ui-react";
import {PopUpConfirmation} from "./PopUpConfirmation";

export class PopUpConfirmationDetailed extends Component {
    render() {
        const {
            title,
            primary,
            secondary,
            trigger,
            onPrimaryAction,
            onSecondaryAction,
            detail,
            positive
        } = this.state
        const {showPopUp} = this.props
        return (
            <PopUpConfirmation
                title={title}
                primary={primary}
                secondary={secondary}
                isManaged
                open={showPopUp}
                trigger={trigger}
                onPrimaryAction={onPrimaryAction}
                onSecondaryAction={onSecondaryAction}
            >
                <div className={'margin-bottom-1'}>
                    {detail}
                </div>
                <div className={'margin-bottom-half'}>
                    <Radio
                        label='Permitir Guardar'
                        name='yes'
                        value={true}
                        checked={this.state.canBeSaved}
                        onChange={this.canRoutineBeSavedByThirdPeople}
                    />
                </div>
                <div>
                    <Radio
                        label='No Permitir'
                        name='no'
                        value={false}
                        checked={!this.state.canBeSaved}
                        onChange={this.canRoutineBeSavedByThirdPeople}
                    />
                </div>
            </PopUpConfirmation>
        )
    }
}