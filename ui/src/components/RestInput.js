import React, {Component} from "react";
import {Input, Label} from "semantic-ui-react";
import {SegMinButtonGroup} from "./SegMinButtonGroup";

export class RestInput extends Component {
    render() {
        const {type} = this.props;
        return (
            <Input type='number' className={'align-center'} fluid placeholder='30' max={300} min={0} action onChange={(e, {value}) => this.props.onChange(type, {amount: value})}>
                <Label>
                    {type === 'lapRest' ? <span>Descanso Ronda&nbsp;&nbsp;&nbsp;&nbsp;</span> : <span>Descanso Ejercicio</span>}
                </Label>
                <input />
                <SegMinButtonGroup default={this.props.default} onIntervalSelected={(i) => this.props.onChange(type, {interval: i})}/>
            </Input>
        )
    }
}