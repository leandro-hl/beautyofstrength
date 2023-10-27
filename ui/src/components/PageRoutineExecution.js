import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Accordion, Button, Divider, Grid, Header, Icon, Label, List, Loader, Segment, Table} from "semantic-ui-react";
import {AppContext, setData} from "../context";
import {InputNumber} from "./InputNumber";
import {Timer} from "./Timer";
import {ExerciseListItemCircuitInterval} from "./ExerciseListItemCircuitInterval";
import {ExerciseListItem} from "./ExerciseListItem";
import {ExerciseListItemCombo} from "./ExerciseListItemCombo";
import {RestInput} from "./RestInput";
import BottomMenuBar from "./BottomMenuBar";
import LayoutMobile from "./LayoutMobile";

class PageRoutineExecution extends Component {
    static contextType = AppContext
    constructor(props) {
        super(props);
        this.state={loading: true, routineDetails:{}, routineFinished: false}
    }

    componentDidMount() {
        const {state: {routineDetails}} = this.context
        this.context.dispatch(setData({
            noBottomBar: true,
            secondaryActions: []
        }))
        const currentBlockIndex = 0
        const block = routineDetails.blocks[currentBlockIndex];
        if (block.type === 'cpt') {
            this.loadTimer(block)
        } else if (block.type === 'amrap') {
            this.startAmrapTimer(block)
        }
        this.setState({
            ...routineDetails,
            currentBlockIndex,
            currentBlock: block,
            currentExercise: 0,
            loading: false
        })
    }

    loadTimer(block) {
        const constantStartInteval = 5
        const timerIntervals = []
        const timerDescriptions = []
        const timerNextDescriptions = []
        const lapFinished = []
        for (let i = 0; i < block.laps; i++) {
            timerIntervals.push(block.laprestinterval)
            timerDescriptions.push('Descanso Ronda')
            timerNextDescriptions.push(block.exercises[0].name)
            lapFinished.push(true)
            for (let j = block.exercises.length; j > 0; j--) {
                if (j < block.exercises.length) {
                    timerIntervals.push(block.exerestinterval)
                    timerDescriptions.push('Descanso Ejercicio')
                    timerNextDescriptions.push(block.exercises[j+1]?.name)
                    lapFinished.push(false)
                }
                timerIntervals.push(block.exercises[j-1].secs)
                timerDescriptions.push(block.exercises[j-1].name)
                timerNextDescriptions.push('Descanso')
                lapFinished.push(false)
            }
        }
        timerIntervals.push(constantStartInteval)
        timerDescriptions.push('Preparense...')
        timerNextDescriptions.push(block.exercises[0].name)
        lapFinished.push(false)
        this.setState({
            timerIntervals,
            timerDescriptions,
            timerNextDescriptions,
            currentDescription: 'Preparense...',
            currentNextDescription: block.exercises[0].name,
            currentWorkingInterval: block.exercises[0].secs,
            currentLaps: block.laps,
            lapFinished})
        return timerIntervals
    }

    onNextInterval() {
        const {timerDescriptions, timerNextDescriptions, lapFinished, currentLaps} = this.state

        if (lapFinished.pop()) {
            this.setState({currentLaps: currentLaps-1})
        }

        this.setState({currentDescription: timerDescriptions.pop(), currentNextDescription: timerNextDescriptions.pop()})
    }

    onFinished() {
        this.setState({finished:true})
    }

    timerMounted(timer) {
        const {timerIntervals} = this.state
        timer.start(timerIntervals)
        this.setState({timerRef: timer})
    }

    componentWillUnmount() {
        const {intervalId} = this.state
        clearInterval(intervalId)
        this.context.dispatch(setData({noBottomBar: false}))
    }

    renderExecuteCpt() {
        const {blocks, currentBlockIndex, currentLaps, currentExercise, currentWorkingInterval, currentDescription, currentNextDescription} = this.state
        const block = blocks[currentBlockIndex];
        return (
            <>
                <Header className={'segment-basic-header'} as={'h3'}>Rondas: {currentLaps} / {block.laps}</Header>
                <Segment basic>
                    <Grid columns={2} relaxed='very'>
                        <Grid.Column textAlign={'center'}>
                            <Label className={'left-label'} basic attached='top center'>Trabajo</Label>
                            <Header className={'segment-basic-header'} as={'h3'}>{currentWorkingInterval}"</Header>
                        </Grid.Column>
                        <Grid.Column textAlign={'center'}>
                            <Label className={'left-label'} basic attached='top center'>Descanso</Label>
                            <Header className={'segment-basic-header'} as={'h3'}>{block.exerestinterval}"</Header>
                        </Grid.Column>
                    </Grid>
                    <Divider vertical>X</Divider>
                </Segment>
                <Segment basic>
                    <Grid>
                        <Grid.Row style={{
                            height: 130,
                            // display: 'flex',
                            // alignItems: 'center'
                        }}>
                            <Grid.Column textAlign={'center'}>
                                <p>Actual:</p>
                                <Header className={'segment-basic-header header-inverse-margin'} as={'h2'}>{currentDescription}</Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column textAlign={'center'}>
                                <p>Tiempo:</p>
                                <Header className={'segment-basic-header header-inverse-margin'} as={'h1'}>
                                    <Timer
                                        onNextInterval={() => this.onNextInterval()}
                                        onFinished={() => this.onFinished()}
                                        onMounted={(timer) => this.timerMounted(timer)}
                                    />
                                </Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column textAlign={'center'}>
                                <p>Siguiente:</p>
                                <Header className={'segment-basic-header header-inverse-margin'} as={'h2'}>{currentNextDescription}</Header>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </>
        )
    }

    renderExecuteAmrap() {
        const {blocks, currentBlockIndex, currentMinute, currentSecond} = this.state
        const block = blocks[currentBlockIndex];
        return (
            <>
                <Segment basic>
                    <Header className={'segment-basic-header'} as={'h3'}>Duracion: {currentMinute??'00'}:{currentSecond? currentSecond > 9 ? currentSecond : '0'+currentSecond : '00'}</Header>
                    <Table basic unstackable style={{border: 'unset'}}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Ejercicio</Table.HeaderCell>
                                <Table.HeaderCell>Trabajo</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {block.exercises.map((e, i) => (
                                <Table.Row key={i}>
                                    <Table.Cell>{e.name}</Table.Cell>
                                    <Table.Cell>{e.reps+' Reps'}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </Segment>
            </>
        )
    }

    renderExecuteCombo() {
        const {blocks, currentBlockIndex} = this.state
        const block = blocks[currentBlockIndex];
        return (
            <>
                <Segment basic>
                    <Header className={'segment-basic-header'} as={'h3'}>Rondas: {block.laps}</Header>
                    <Table basic unstackable style={{border: 'unset'}}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Ejercicio</Table.HeaderCell>
                                <Table.HeaderCell>Trabajo</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {block.exercises.map((e, i) => (
                                <Table.Row key={i}>
                                    <Table.Cell>{e.name}</Table.Cell>
                                    <Table.Cell>{e.reps+' Reps'}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </Segment>
            </>
        )
    }

    renderExecutePir() {
        const {blocks, currentBlockIndex} = this.state
        const block = blocks[currentBlockIndex];
        return (
            <>
                <Segment basic>
                    <Header className={'segment-basic-header'} as={'h3'}>Rondas: {block.laps}</Header>
                    <Table basic unstackable style={{border: 'unset'}}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Ejercicio</Table.HeaderCell>
                                <Table.HeaderCell>Trabajo</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {block.exercises.map((e, i) => (
                                <Table.Row key={i}>
                                    <Table.Cell>{e.name}</Table.Cell>
                                    <Table.Cell>{e.reps+' Reps'}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </Segment>
            </>
        )
    }

    renderExecution() {
        const {currentBlock} = this.state;
        switch (currentBlock.type) {
            case 'cpt':
                return this.renderExecuteCpt()
            case 'amrap':
                return this.renderExecuteAmrap()
            case 'cbo':
                return this.renderExecuteCombo()
            case 'pir':
                return this.renderExecutePir()
            default:
                return (
                    <></>
                )
        }
    }

    startAmrapTimer(block) {
        const intervalId = setInterval(() => {
            const {currentMinute, currentSecond, reset} = this.state
            if (!currentMinute || reset) {
                this.setState({currentMinute: block.duration, currentSecond: 60, reset: false})
            } else if (currentSecond === 0) {
                if(currentMinute === 0) {
                    clearInterval(intervalId)
                } else {
                    this.setState({currentMinute:currentMinute-1, currentSecond: 60})
                }
            } else {
                this.setState({currentSecond: currentSecond-1})
            }
        }, 1000)
        this.setState({intervalId})
    }

    nextBlock() {
        const {currentBlockIndex, blocks, timerRef, intervalId} = this.state;
        const newIndex = currentBlockIndex+1

        if (newIndex === blocks.length) {
            this.setState({routineFinished: true})
            return
        }

        const block = blocks[newIndex];
        clearInterval(intervalId)
        switch (block.type) {
            case 'cpt':
                if (timerRef) {
                    timerRef.stop()
                    const intervals = this.loadTimer(block)
                    timerRef.start(intervals)
                } else {
                    this.loadTimer(block)
                }
                break
            case 'amrap':
                this.setState({reset: true})
                this.startAmrapTimer(block)
                break
            case 'cbo':
                break
            case 'pir':
                break
            default:
                break
        }
        this.setState({
            currentBlockIndex: newIndex,
            currentBlock: block,
            currentExercise: 0
        })
    }

    render() {
        const {loading, currentBlock, name, routineFinished} = this.state;
        if (loading) {
            return <Loader active/>
        }
        if (routineFinished) {
            return (
                <Segment basic style={{height: '100%'}}>
                    <Segment>
                        <Header as={'h3'} className={'segment-basic-header'}>Rutina finalizada!</Header>
                    </Segment>
                </Segment>
            )
        }
        return (
            <>
                <Header as={'h3'}>
                    <Button className={'header-back-arrow'} icon onClick={() => this.props.history.push('/routine')}>
                        <Icon name={'arrow left'}/>
                    </Button>
                    {name} - {currentBlock.name}
                </Header>
                <Button style={{marginBottom: '1em'}} primary fluid onClick={() => this.nextBlock()}>Continuar Proximo Bloque</Button>
                <Segment style={{height: '85%'}}>
                    {this.renderExecution()}
                </Segment>
            </>
        )
    }
}

export default withRouter(PageRoutineExecution);