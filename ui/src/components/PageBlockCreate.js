import React, {Component, createRef} from "react";
import {Button, Divider, Dropdown, Grid, Header, Input, Label, List, Segment} from "semantic-ui-react";
import {ExerciseListItem} from "./ExerciseListItem";
import {RestInput} from "./RestInput";
import {listExercises, saveExercisesBlock, saveExercisesBlockCpt, signIn} from "../service";
import {withRouter} from "react-router-dom";
import {ModalTrainingBlockType} from "./ModalTrainingBlockType";
import {ExerciseListItemCircuitInterval} from "./ExerciseListItemCircuitInterval";
import {InputNumber} from "./InputNumber";
import {queryParam} from "../functions";

class PageBlockCreate extends Component {
    dropdownRef = createRef()

    constructor(props) {
        super(props);

        const planificationId = queryParam(props, 'planificationId')
        const routineId = queryParam(props, 'routineId')
        const nextBlockNumber = queryParam(props, 'nextBlockNumber')
        this.state = {planificationId, routineId, exercisesBuffer: [], blockName: 'Bloque '+(nextBlockNumber??1), exercises: [], exerciseOptions: [], lapRestDefault: 'sec', exeRestDefault: 'sec'}
    }

    async componentDidMount() {
        try {
            this.setState({loading: true})
            await signIn('juan123')
            const res = await listExercises()
            this.setState({loading: false, exerciseOptions: res.data.map(e => ({key: e.id, value:e.id, text:e.name}))})
        } catch (e) {
            console.error(e)
        }
    }

    saveExercise(i, reps) {
        const {exercises} = this.state
        const index = exercises.indexOf(i)
        exercises[index].reps = reps

        this.setState({exercises})
        if (this.dropdownRef.current) {
            const inputElement = this.dropdownRef.current.querySelector('input');
            if (inputElement) {
                inputElement.focus();
            }
        }
    }

    handleChange = (e, input) => {
        const exercises = input.value.map(v => (input.options.find(x => x.value === v)))
        this.setState({exercisesBuffer: [...exercises]})
    }

    restUpdate(type, obj) {
        this.setState({[type]: {...this.state[type], ...obj}})
    }

    redirectToParentRoutine(routineId) {
        this.props.history.push('/routine?routineId='+routineId)
    }

    async saveExercisesBlockCpt() {
        try {
            const {exercises, laps, workingInterval, restingInteval, blockName, planificationId, routineId} = this.state
            this.setState({saving: true})

            if(!workingInterval || !restingInteval || !laps) {
                //todo required validation.
            }

            const request = {
                planificationId: parseInt(planificationId,10),
                routineId: !!routineId ? parseInt(routineId,10) : null,
                blockName: blockName,
                exercises: exercises.map(e => ({id:e.key})),
                laps: parseInt(laps, 10),
                workingInterval: parseInt(workingInterval, 10),
                restingInteval: parseInt(restingInteval, 10)
            }
            const res = await saveExercisesBlockCpt(request)
            this.redirectToParentRoutine(res.data.routineId)
        } catch (e) {
            console.log(e)
        }
    }

    async saveExercisesBlock() {
        try {
            const {exercises, laps, lapRest, exeRest, lapRestDefault, exeRestDefault} = this.state
            this.setState({saving: true})

            if(!lapRest.interval) {
                lapRest.interval = lapRestDefault
            }
            if(!exeRest.interval) {
                exeRest.interval = exeRestDefault
            }

            lapRest.amount = parseFloat(lapRest.amount)
            exeRest.amount = parseFloat(exeRest.amount)

            const request = {
                exercises: exercises.map(e => ({id:e.key, reps: parseInt(e.reps, 10)})),
                laps: parseInt(laps, 10),
                lapRest,
                exeRest
            }
            const res = await saveExercisesBlock(request)

            this.setState({saving: false})
        } catch (e) {
            console.log(e)
        }
    }

    generateBlockTypeUI(id, name) {
        const {exercisesBuffer, blockName} = this.state;
        this.setState({showModal: false, blockType: id, exercises: [...exercisesBuffer], exercisesBuffer: [], blockName: blockName+': '+name})
    }

    renderBlockTypeUI() {
        const {blockType, lapRestDefault, exercises} = this.state;

        switch (blockType) {
            case 'cpt':
                return (
                    <>
                        <List>
                            {
                                exercises.map((i, index) => {
                                    return (<ExerciseListItemCircuitInterval key={index} item={i}/>)
                                })
                            }
                        </List>
                        <Divider hidden/>
                        <Segment textAlign='center'>
                            <Segment basic style={{
                                paddingLeft: '0px',
                                paddingRight: '0px',
                                paddingTop: '0px',
                                paddingBottom: '0.5em'
                            }}>
                                <Grid columns={2} relaxed='very'>
                                    <Grid.Column>
                                        <InputNumber label={'Trabajo'} seconds large onChange={({amount}) => this.setState({workingInterval: amount})}/>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <InputNumber label={'Descanso'} seconds large onChange={({amount}) => this.setState({restingInteval: amount})}/>
                                    </Grid.Column>
                                </Grid>
                                <Divider vertical>X</Divider>
                            </Segment>
                            <Divider horizontal>Rondas</Divider>
                            <InputNumber large onChange={({amount}) => this.setState({laps: amount})}/>
                        </Segment>
                        <Button.Group fluid>
                            <Button secondary onClick={() => this.props.history.goBack()}>Cancelar</Button>
                            <Button primary onClick={() => this.saveExercisesBlockCpt()}>Guardar</Button>
                        </Button.Group>
                    </>
                )
            default:
                return (
                    <>
                        <List>
                            {
                                exercises.map((i, index) => {
                                    return (<ExerciseListItem key={index} item={i} finished={(reps) => this.saveExercise(i, reps)}/>)
                                })
                            }
                        </List>
                        <RestInput default={lapRestDefault} type={'lapRest'} onChange={(type, obj) => this.restUpdate(type, obj)}/>
                        <Input type='number' className={'align-center'} fluid placeholder='4' max={9} min={0} action onChange={(e, {value}) => this.setState({laps: value})}>
                            <Label>Rondas</Label>
                            <input/>
                        </Input>
                    </>
                )
        }
    }

    render() {
        const {blockType, exerciseOptions, blockName, showModal} = this.state;

        return (
            <Segment basic style={{height: '100%'}}>
                <Header as={'h3'}>{blockName}</Header>
                {
                    !blockType &&
                    <>
                        <div ref={this.dropdownRef}>
                            <Dropdown
                                placeholder='Elegi los ejercicios'
                                fluid
                                multiple
                                search
                                selection
                                options={exerciseOptions}
                                onChange={this.handleChange}
                                openOnFocus={true}
                                tabIndex={0}
                                noResultsMessage={'No se encontro el ejercicio'}
                                selectOnBlur={false}
                            />
                        </div>
                        <Divider hidden/>
                        <Button.Group fluid style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0
                        }}>
                            <Button secondary onClick={() => this.props.history.push('/')}>Cancelar</Button>
                            <Button primary onClick={() => this.setState({showModal: true})}>Generar</Button>
                        </Button.Group>
                    </>
                }
                {blockType && this.renderBlockTypeUI()}
                <ModalTrainingBlockType showModal={showModal} onClose={() => this.setState({showModal: false})} onTypeSelected={(id, name) => this.generateBlockTypeUI(id, name)}/>
            </Segment>
        )
    }
}

export default withRouter(PageBlockCreate);