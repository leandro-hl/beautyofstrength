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