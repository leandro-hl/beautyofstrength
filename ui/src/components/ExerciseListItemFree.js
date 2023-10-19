import React, {Component, createRef} from "react";
import {Grid, Icon, Input, Label, List} from "semantic-ui-react";
import {SegMinButtonGroup} from "./SegMinButtonGroup";
import {SegRepsButtonGroup} from "./SegRepsButtonGroup";

export class ExerciseListItemFree extends Component {
    inputRef = createRef()

    constructor(props) {
        super(props);
        this.state = {value: null}
    }

    componentDidMount() {
        if(this.props.focus) {
            this.inputRef.current.focus()
        }
    }

    handleChange(value) {
        this.setState({value: value})
        if (10 / value <= 1) {
            this.props.finished(value, true)
        } else {
            this.props.finished(value)
        }
    }

    handleKeyDown(event) {
        const key = event.key.toLowerCase()
        const {value} = this.state;
        if (key === 'enter' || key === 'tab') {
            this.props.finished(value, true)
        }
    };

    render() {
        if(this.props.focus && this.inputRef.current) {
            this.inputRef.current.focus()
        }
        return (
            <List.Item key={this.props.item.key}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10} stretched style={{paddingRight: 0}}>
                            <Label basic style={{width: '100%', padding: 20}} className={this.props.selected ? 'mine-selected' : ''}>
                                <Icon name="chevron up" className={'chevron-up-icon-stacked'} onClick={() => this.props.moveUp()}/>
                                <Icon name="chevron down" className={'chevron-down-icon-stacked'} onClick={() => this.props.moveDown()}/>
                                {this.props.item.text}
                                { this.props.onRepeat && <Icon name={'sync'} className={'list-item-icon-input-top-right'}
                                       onClick={() => this.props.onRepeat(this.props.item)}/>
                                }
                            </Label>
                        </Grid.Column>
                        <Grid.Column width={3} stretched style={{paddingLeft: 0, paddingRight: 0}}>
                            <Input fluid
                                   ref={this.inputRef} placeholder='10' type={'number'}
                                   min={1}
                                   max={99}
                                   value={this.props.value}
                                   onKeyDown={(event) => this.handleKeyDown(event)}
                                   onChange={(e, {value}) => this.handleChange(value)}/>
                        </Grid.Column>
                        <Grid.Column width={3} stretched style={{paddingLeft: 0}}>
                            <SegRepsButtonGroup default={'reps'} onIntervalSelected={(i) => this.props.onIntervalSelected(i)}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </List.Item>
        )
    }
}