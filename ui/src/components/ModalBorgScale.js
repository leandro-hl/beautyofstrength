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