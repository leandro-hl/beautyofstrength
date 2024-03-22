import React, {Component, createRef} from "react";
import {Dropdown, Grid, Icon, Input, Label, List, Segment} from "semantic-ui-react";
import {SegMinButtonGroup} from "./SegMinButtonGroup";
import {SegRepsButtonGroup} from "./SegRepsButtonGroup";

export class ExerciseListItemFree extends Component {
    inputRef = createRef()
    inputRefSeries = createRef()

    constructor(props) {
        super(props);
        this.state = {focusSeries:true, series: props.item.series}
    }

    componentDidMount() {
        if(this.props.focus) {
            if (this.props.disableSeries) {
                this.inputRef.current.focus()
            } else {
                this.inputRefSeries.current.focus()
            }
        }
    }

    handleChangeSerie(value) {
        this.setState({series: value, focusSeries: false})
        this.inputRef.current.focus()
    }

    handleChange(value) {
        const {series} = this.state
        if (10 / value <= 1) {
            this.props.finished(series, value, true)
        } else {
            this.props.finished(series, value)
        }
    }

    handleKeyDown(event) {
        const {series} = this.state
        const key = event.key.toLowerCase()
        if (key === 'enter' || key === 'tab') {
            this.props.finished(series, this.props.item.reps, true)
        }
    };

    render() {
        if(this.props.focus) {
            if (!this.props.disableSeries && this.inputRefSeries.current && this.state.focusSeries) {
                this.inputRefSeries.current.focus()
            } else if (this.inputRef.current) {
                this.inputRef.current.focus()
            }
        }
        const options = [
            { key: 1, text: <Icon name="chevron up" onClick={() => this.props.moveUp()}/>, value: 1 },
            { key: 2, text: <Icon name="chevron down" onClick={() => this.props.moveDown()}/>, value: 2 },
        ]
        if(this.props.onRepeat) {
            options.push({ key: 3, text: <Icon name={'sync'} onClick={() => this.props.onRepeat(this.props.item)}/>, value: 3 })
        }
        return (
            <Segment className={`no-margin no-padding ${this.props.selected ? 'mine-selected' : ''}`}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={7} stretched className={'no-padding'}>
                            <div className={'center-content-vertically'}>
                                <div>
                                    <Dropdown icon='ellipsis vertical' text={''} options={options} simple item
                                              value={null}/>
                                    {this.props.item.text}
                                </div>
                            </div>
                        </Grid.Column>
                        <Grid.Column width={2} stretched className={'no-padding'}>
                            <Input fluid
                                   disabled={this.props.disableSeries}
                                   ref={this.inputRefSeries} placeholder='1' type={'number'}
                                   min={1}
                                   max={99}
                                   value={this.props.item.series}
                                   onKeyDown={(event) => this.handleKeyDown(event)}
                                   onChange={(e, {value}) => this.handleChangeSerie(value)}/>
                        </Grid.Column>
                        <Grid.Column width={1} stretched className={'no-padding'}>
                            <div className={'center-content-vh'}>
                                <span>X</span>
                            </div>
                        </Grid.Column>
                        <Grid.Column width={3} stretched className={'no-padding'}>
                            <Input fluid
                                   ref={this.inputRef} placeholder='8' type={'number'}
                                   min={1}
                                   max={99}
                                   value={this.props.item.reps}
                                   onKeyDown={(event) => this.handleKeyDown(event)}
                                   onChange={(e, {value}) => this.handleChange(value)}/>
                        </Grid.Column>
                        <Grid.Column width={3} stretched style={{paddingLeft: 0}}>
                            <SegRepsButtonGroup default={'reps'} onIntervalSelected={(i) => this.props.onIntervalSelected(i)}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
}