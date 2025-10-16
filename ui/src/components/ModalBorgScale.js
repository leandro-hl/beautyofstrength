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
import {Button, Input, Message, Modal, Segment} from "semantic-ui-react";
import {BorgSlider} from "./mui/BorgSlider";
import {calculatePostTrainingRoutineBorgScale, calculatePreStartRoutineBorgScale} from "../functions";
import {Grid} from "@mui/material";

export class ModalBorgScale extends Component {
    handleConfirm() {
        const {
            preWorkoutReadiness,
            ratePerceivedExertion
        }=this.state
        if(preWorkoutReadiness !== undefined && ratePerceivedExertion!== undefined) {
            this.props.onConfirm(preWorkoutReadiness, ratePerceivedExertion)
        } else {
            this.setState({showError: true})
        }
    }

    render() {
        return (
            <Modal
                open={true}
                closeIcon
                // dimmer={'blurring'}
                onClose={() => this.props.onCancel()}
            >
                <Modal.Header>
                    Finalizar Rutina
                </Modal.Header>
                <Modal.Content scrolling>
                    <Grid container item justifyContent={'center'} pl={4} pr={4} pt={4}>
                        Como empezaste tu entrenamiento?
                        <BorgSlider onChange={(val) => this.setState({preWorkoutReadiness: val})} config={calculatePreStartRoutineBorgScale()}/>
                    </Grid>
                    <Grid container item justifyContent={'center'} pl={4} pr={4}>
                        Como fue tu experiencia?
                        <BorgSlider onChange={(val) => this.setState({ratePerceivedExertion: val})} config={calculatePostTrainingRoutineBorgScale()}/>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    {this.state?.showError && <Message error content={'Elige un valor de la escala para continuar'}/> }
                    <Button primary onClick={() => this.handleConfirm()}>Confirmar</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}