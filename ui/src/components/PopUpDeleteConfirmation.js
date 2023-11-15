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