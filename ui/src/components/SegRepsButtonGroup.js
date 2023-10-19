import React, {Component} from "react";
import {Button} from "semantic-ui-react";

export class SegRepsButtonGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {repsIsPrimary: props.default === 'reps'}
    }
    selected(interval) {
        this.setState({repsIsPrimary: interval === 'reps'})
        this.props.onIntervalSelected(interval)
    }
    render() {
        const {repsIsPrimary} = this.state
        return (
            <Button.Group vertical>
                <Button secondary={!repsIsPrimary} primary={repsIsPrimary} onClick={() => this.selected('reps')}>Reps</Button>
                <Button primary={!repsIsPrimary} secondary={repsIsPrimary} onClick={() => this.selected('sec')}>Seg</Button>
            </Button.Group>
        )
    }
}