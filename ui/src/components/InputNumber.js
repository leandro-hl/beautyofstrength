import React, {Component} from "react";
import {Input, Label} from "semantic-ui-react";

export class InputNumber extends Component {
    render() {
        return (
            <Input
                label={this.props.label ? <Label basic attached='top left'>{this.props.label}</Label> : null}
                type='number'
                   className={`align-center input-left-label ${this.props.large ? 'input-large' : ''}`}
                   fluid placeholder={this.props.seconds ? '30"' : 5}
                   max={300} min={0} action
                   onChange={(e, {value}) => this.props.onChange({amount: value})}/>
        )
    }
}