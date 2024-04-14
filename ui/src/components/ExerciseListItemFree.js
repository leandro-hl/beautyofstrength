import React, {Component, createRef} from "react";
import {Dropdown, Grid, Icon, Input, Label, List, Segment} from "semantic-ui-react";
import {SegMinButtonGroup} from "./SegMinButtonGroup";
import {SegRepsButtonGroup} from "./SegRepsButtonGroup";
import {ExerciseSearch} from "./ExerciseSearch";
import {TextFieldCentered} from "./mui/customizations";

export class ExerciseListItemFree extends Component {
    inputRef = createRef()
    inputRefSeries = createRef()

    constructor(props) {
        super(props);
        this.state = {focusSeries:true}
    }

    handleChangeSerie(value) {
        this.props.finished(value, null)
        if (value !== "") {
            this.setState({focusSeries: false})
            this.inputRef.current.focus()
        } else {
            this.setState({focusSeries: true})
        }
    }

    handleChange(value) {
        if (10 / value <= 1) {
            this.props.finished(this.props.item.series, value, true)
        } else {
            this.props.finished(this.props.item.series, value)
        }
    }

    handleKeyDown(event) {
        const key = event.key.toLowerCase()
        if (key === 'enter' || key === 'tab') {
            this.props.finished(this.props.item.series, this.props.item.reps, true)
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
            <Segment className={`no-padding ${this.props.selected ? 'mine-selected' : ''}`}>
                <Grid>
                    <Grid.Row className={!this.props.hideAddNext ? 'padding-bottom-1-5' : ''}>
                        <Grid.Column width={1} stretched className={'no-padding'}>
                            <div className={'center-content-vertically'}>
                                <div>
                                    <Dropdown icon='ellipsis vertical' text={''} options={options} simple item
                                              value={null}/>
                                </div>
                            </div>
                        </Grid.Column>
                        <Grid.Column width={6} stretched className={'no-padding'}>
                            <ExerciseSearch
                                basic
                                allowAdditions
                                defaultSelected={[this.props.item]}
                                onSelected={(selected) => {
                                    this.props.onExerciseSelected(selected)
                                }}/>
                        </Grid.Column>
                        <Grid.Column width={2} stretched className={'no-padding'}>
                            <TextFieldCentered
                                disabled={this.props.disableSeries}
                                className={'size-two-digits padding-top-1'}
                                inputRef={this.inputRefSeries}
                                placeholder='1'
                                value={this.props.item.series}
                                onKeyDown={(event) => this.handleKeyDown(event)}
                                onChange={(e) => this.handleChangeSerie(e.target.value)}
                                variant="standard" />
                        </Grid.Column>
                        <Grid.Column width={1} stretched className={'no-padding'}>
                            <div className={'center-content-vh padding-top-1'}>
                                <span>X</span>
                            </div>
                        </Grid.Column>
                        <Grid.Column width={3} stretched className={'no-padding'}>
                            <TextFieldCentered
                                className={'size-two-digits padding-top-1'}
                                inputRef={this.inputRef}
                                placeholder='8'
                                value={this.props.item.reps}
                                onKeyDown={(event) => this.handleKeyDown(event)}
                                onChange={(e) => this.handleChange(e.target.value)}
                                variant="standard" />
                        </Grid.Column>
                        <Grid.Column width={3} stretched style={{paddingLeft: 0}}>
                            <SegRepsButtonGroup default={'reps'}
                                                onIntervalSelected={(i) => this.props.onIntervalSelected(i)}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                {!this.props.hideAddNext && <div className={'table-plus-item table-plus-item-15-negative'}>
                    <Icon
                        name={'plus circle'}
                        onClick={() => this.props.onAddExercise()}/>
                </div>}
            </Segment>
        )
    }
}