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
import {PopUpConfirmation} from "./PopUpConfirmation";

export class PopUpDeleteConfirmation extends Component {
    render() {
        return (
            <></>
            // <PopUpConfirmation
            //     title={'Borrar rutina '+p.name+'?'}
            //     primary={'Borrar'}
            //     secondary={'Cancelar'}
            //     isManaged
            //     open={i===confirmRoutineDeletionIndex}
            //     trigger={<Button disabled={disableActions}
            //                      onClick={() => this.openDeleteRoutinePopUpConfirmation(i)}
            //                      basic secondary icon='close' style={{position: 'relative', float: 'right'}}/>}
            //     onPrimaryAction={() => this.deleteRoutine(p.id, i)}
            //     onSecondaryAction={() => this.setState({confirmRoutineDeletionIndex: null})}
            // />
        )
    }
}