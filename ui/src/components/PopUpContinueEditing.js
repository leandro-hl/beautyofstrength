import React, {Component} from "react";
import {Button, Grid, Icon, Popup} from "semantic-ui-react";
import {PopUpConfirmation} from "./PopUpConfirmation";

export class PopUpContinueEditing extends Component {
    discardChanges() {
        this.props.onDiscardChanges()
    }

    render() {
        return <PopUpConfirmation
            title={'Descartar los cambios realizados?'}
            primary={'Seguir Editando'}
            secondary={'Descartar'}
            onSecondaryAction={() => this.discardChanges()}
        />
    }
}