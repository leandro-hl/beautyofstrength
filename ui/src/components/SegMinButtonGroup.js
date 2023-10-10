import React, {Component} from "react";
import {Button} from "semantic-ui-react";

export class SegMinButtonGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {minIsPrimary: props.default === 'min'}
    }
    selected(interval) {
        this.setState({minIsPrimary: interval === 'min'})
        this.props.onIntervalSelected(interval)
    }
    render() {
        const {minIsPrimary} = this.state
        return (
            <Button.Group>
                <Button primary={!minIsPrimary} secondary={minIsPrimary} onClick={() => this.selected('sec')}>Seg</Button>
                {/*<Button secondary={!minIsPrimary} primary={minIsPrimary} onClick={() => this.selected('min')}>Min</Button>*/}
            </Button.Group>
        )
    }
}