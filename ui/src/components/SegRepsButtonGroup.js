import React, {Component} from "react";
import {Button} from "semantic-ui-react";
import {Chip} from "./Chip";

export class SegRepsButtonGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {repsIsPrimary: props.default === 'reps'}
    }
    selected(interval) {
        this.setState({repsIsPrimary: interval === 'reps'})
        if(this.props.onIntervalSelected) {
            this.props.onIntervalSelected(interval)
        }
    }
    render() {
        const {repsIsPrimary} = this.state
        return (
            <Button.Group vertical>
                <Button as={Chip} basic={!repsIsPrimary} secondary={!repsIsPrimary} primary={repsIsPrimary} onClick={() => this.selected('reps')}>Rep</Button>
                <Button as={Chip} basic={repsIsPrimary} secondary={repsIsPrimary} primary={!repsIsPrimary} onClick={() => this.selected('secs')}>Seg</Button>
            </Button.Group>
        )
    }
}