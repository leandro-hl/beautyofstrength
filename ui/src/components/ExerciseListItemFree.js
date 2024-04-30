import React, {Component, createRef} from "react";
import {Dropdown, Grid, Icon, Input, Label, List, Loader, Segment} from "semantic-ui-react";
import {SegMinButtonGroup} from "./SegMinButtonGroup";
import {SegRepsButtonGroup} from "./SegRepsButtonGroup";
import {ExerciseSearch} from "./ExerciseSearch";
import {TextFieldBottomSmooth, TextFieldCentered} from "./mui/customizations";
import {TextField} from "@mui/material";

export class ExerciseListItemFree extends Component {
    inputRefExercise = createRef()
    inputRefSeries = createRef()
    inputRefReps = createRef()
    inputRefNotes = createRef()


    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            focusList:[],
            focusCurrent:0,
        }
    }

    componentDidMount() {
        this.setState({
            focusList:[
                this.inputRefExercise,
                this.inputRefSeries,
                this.inputRefReps,
                this.inputRefNotes
            ]
        })
    }

    handleChangeSerie(value) {
        this.props.finished(value, null)
        if (value !== "") {
            this.setState({focusCurrent:2})
        } else {
            this.setState({focusCurrent:1})
        }
    }

    handleChangeReps(value) {
        if (10 / value <= 1) {
            if (this.props.configureNotes) {
                this.setState({focusCurrent:3})
                this.props.finished(this.props.item.series, value)
            } else {
                this.props.finished(this.props.item.series, value, true)
            }
        } else {
            this.props.finished(this.props.item.series, value)
        }
    }

    handleKeyDown(event) {
        const key = event.key.toLowerCase()
        if (key === 'enter' || key === 'tab') {
            if (this.props.configureNotes) {
                this.setState({focusCurrent:3})
                this.props.finished(this.props.item.series, this.props.item.reps)
            } else {
                this.props.finished(this.props.item.series, this.props.item.reps, true)
            }
        }
    };

    handleKeyDownEnd(event) {
        const key = event.key.toLowerCase()
        if (key === 'enter' || key === 'tab') {
            this.props.finished(this.props.item.series, this.props.item.reps, true)
        }
    };

    render() {
        if(this.props.focus) {
            if (this.state.focusCurrent===0) {
                this.state.focusList[this.state.focusCurrent]?.current?.open()
            } else {
                this.state.focusList[this.state.focusCurrent]?.current?.focus()
            }
        }
        // const options = [
        //     { key: 1, text: <Icon name="chevron up" onClick={() => this.props.moveUp()}/>, value: 1 },
        //     { key: 2, text: <Icon name="chevron down" onClick={() => this.props.moveDown()}/>, value: 2 },
        // ]
        // if(this.props.onRepeat) {
        //     options.push({ key: 3, text: <Icon name={'sync'} onClick={() => this.props.onRepeat(this.props.item)}/>, value: 3 })
        // }

        let exerciseSearchWidth=8
        if (!this.props.withSeries) {
            exerciseSearchWidth+=3
        }
        if(!this.props.configureSelectRepSec) {
            exerciseSearchWidth += 3
        }
        if(this.state.searchFocused) {
            exerciseSearchWidth = 16
        }

        const segRepDefault = this.props.item.type ?? (this.props.configureDefaultSec ? 'secs' : 'reps')

        return (
            <Segment className={`no-padding ${this.props.selected ? 'mine-selected' : ''}`} basic>
                <Grid>
                    <Grid.Row style={{ flexWrap:'nowrap' }} className={this.props.configureNotes ? 'no-bottom-padding' : ''}>
                        {/*<Grid.Column width={1} stretched>*/}
                        {/*    <div className={'center-content-vertically'}>*/}
                        {/*        <div>*/}
                        {/*            <Dropdown icon='ellipsis vertical' text={''} options={options} simple item*/}
                        {/*                      value={null}/>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</Grid.Column>*/}
                        <Grid.Column width={exerciseSearchWidth} stretched className={'no-right-padding'} style={{transition: 'width 0.5s'}}>
                            <ExerciseSearch
                                basic
                                inputRef={this.inputRefExercise}
                                allowAdditions={this.props.createNewExercises}
                                defaultSelected={[this.props.item]}
                                onLoaded={() => this.setState({loading: false})}
                                onFocus={() => {
                                    this.setState({searchFocused: true})
                                    this.props.onFocusItem()
                                }}
                                onBlur={() => this.setState({searchFocused: false})}
                                onSelected={(selected) => {
                                    this.props.onExerciseSelected(selected)
                                    this.setState({focusCurrent: this.props.withSeries? 1 : 2})
                                }}/>
                        </Grid.Column>
                        {
                            this.props.withSeries &&
                            <>
                                <Grid.Column width={2} stretched className={'no-padding'}>
                                    <TextFieldCentered
                                        style={{justifyContent: 'center'}}
                                        className={'padding-top-1'}
                                        inputRef={this.inputRefSeries}
                                        placeholder='1'
                                        value={this.props.item.series}
                                        onChange={(e) => this.handleChangeSerie(e.target.value)}
                                        onFocus={() => {
                                            this.setState({focusCurrent: 1, searchFocused:false})
                                            this.props.onFocusItem()
                                        }}
                                        type={'number'}
                                        variant="standard" />
                                </Grid.Column>
                                <Grid.Column width={1} stretched className={'no-padding'}>
                                    <div className={'center-content-vh padding-top-1'} style={{justifyContent: 'center'}}>
                                        <span>X</span>
                                    </div>
                                </Grid.Column>
                            </>
                        }
                        <Grid.Column width={2} stretched className={ this.props.configureSelectRepSec ? 'no-padding' : 'no-left-padding'}>
                            <TextFieldCentered
                                style={{justifyContent: 'center'}}
                                className={'padding-top-1'}
                                inputRef={this.inputRefReps}
                                placeholder='8'
                                value={this.props.item.reps}
                                type={'number'}
                                onFocus={() => {
                                    this.setState({focusCurrent: 2, searchFocused:false})
                                    this.props.onFocusItem()
                                }}
                                onKeyDown={(event) => this.handleKeyDown(event)}
                                onChange={(e) => this.handleChangeReps(e.target.value)}
                                variant="standard" />
                        </Grid.Column>
                        {
                            this.props.configureSelectRepSec &&
                            <Grid.Column width={3} stretched style={{paddingLeft: 0}}>
                                <SegRepsButtonGroup
                                    default={segRepDefault}
                                    onIntervalSelected={(i) => this.props.onIntervalSelected(i)}/>
                            </Grid.Column>
                        }
                    </Grid.Row>
                    {
                        this.props.configureNotes &&
                        <Grid.Row className={'no-top-padding'}>
                            <Grid.Column>
                                <TextField
                                    onKeyDown={(event) => this.handleKeyDownEnd(event)}
                                    inputRef={this.inputRefNotes}
                                    fullWidth
                                    variant="standard"
                                    multiline
                                    minRows={2}
                                    placeholder="Notas del ejercicio"
                                    className={'gray-input'}
                                    value={this.props.item.notes}
                                    onFocus={() => {
                                        this.setState({focusCurrent: 3, searchFocused:false})
                                        this.props.onFocusItem()
                                    }}
                                    onChange={(e) => this.props.onNotesChanged(e.target.value)}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    }
                </Grid>
            </Segment>
        )
    }
}