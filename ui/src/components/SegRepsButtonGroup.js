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