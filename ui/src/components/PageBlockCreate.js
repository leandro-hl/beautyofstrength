import React, {Component, createRef} from "react";
import {Button, Divider, Dropdown, Grid, Header, Icon, Input, Label, List, Message, Segment} from "semantic-ui-react";
import {ExerciseListItem} from "./ExerciseListItem";
import {RestInput} from "./RestInput";
import {
    listExercises, saveExerciseBlockPir,
    saveExercisesBlock,
    saveExercisesBlockAmrap,
    saveExercisesBlockCombo,
    saveExercisesBlockCpt,
    signIn
} from "../service";
import {withRouter} from "react-router-dom";
import {ModalTrainingBlockType} from "./ModalTrainingBlockType";
import {ExerciseListItemCircuitInterval} from "./ExerciseListItemCircuitInterval";
import {InputNumber} from "./InputNumber";
import {ExerciseListItemCombo} from "./ExerciseListItemCombo";
import {AppContext, setData} from "../context";

class PageBlockCreate extends Component {
    static contextType = AppContext
    dropdownRef = createRef()

    constructor(props) {
        super(props);
        //todo: this config probably should come from the backend
        const defaultPiramidTop = 12
        const defaultIncrementPerSerie = 2
        const defaultPiramidSeries = Math.floor(defaultPiramidTop / defaultIncrementPerSerie)
        this.state = {
            planificationId: null,
            routineId: null,
            defaultPiramidTop,
            defaultIncrementPerSerie,
            defaultPiramidSeries,
            next: 0,
            exercisesBuffer: [], defaultBlockName: '', blockName: '', exercises: [], exerciseOptions: [], lapRestDefault: 'sec', exeRestDefault: 'sec'}
    }

    async componentDidMount() {
        try {
            const {state: {planificationId, routineId, routineDetails: {nextBlockNumber}}} = this.context
            this.setState({loading: true})
            await signIn('juan123')
            const res = await listExercises()
            let biggerId = 0
            for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].id > biggerId) {
                    biggerId = res.data[i].id
                }
            }
            const defaultBlockName = 'Bloque '+(nextBlockNumber??1)
            this.setState({
                loading: false,
                biggerId,
                planificationId,
                routineId,
                defaultBlockName, blockName: defaultBlockName,
                exerciseOptions: res.data.map(e => ({key: e.id, value:e.id, text:e.name, createdbyuser: e.createdbyuser.toLowerCase(), comparer: e.name.toLowerCase().trim().replaceAll(' ', '')}))})
        } catch (e) {
            console.error(e)
        }
    }

    saveExerciseV1(i, reps) {
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

    saveExercise(i, reps) {
        const {exercises} = this.state
        const index = exercises.indexOf(i)
        exercises[index].reps = reps
        this.setState({exercises, next: index+1})
    }

    handleExerciseSelection = (e, input) => {
        if (typeof(input.value[input.value.length-1]) === 'string') {
            return
        }

        const exercises = input.value.map(v => (input.options.find(x => x.value === v)))
        this.setState({exercisesBuffer: [...exercises]})
    }

    restUpdate(type, obj) {
        this.setState({[type]: {...this.state[type], ...obj}})
    }

    redirectToParentRoutine(addedToRoutineId) {
        const {state: {routineId}} = this.context
        if (routineId !== addedToRoutineId) {
            this.context.dispatch(setData({routineId: addedToRoutineId}))
        }
        this.props.history.push('/routine')
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
                exercises: exercises.map(e => ({id:e.key, name:e.text})),
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

    async saveExercisesBlockAmrap() {
        try {
            const {exercises, blockName, blockDuration, planificationId, routineId} = this.state
            this.setState({saving: true})

            if(!blockDuration) {
                //todo required validation.
            }

            const request = {
                planificationId: parseInt(planificationId,10),
                routineId: !!routineId ? parseInt(routineId,10) : null,
                blockName: blockName,
                exercises: exercises.map(e => ({id:e.key, name:e.text, reps: parseInt(e.reps, 10)})),
                blockDuration: parseInt(blockDuration,10),
                laps: null,
                workingInterval: null,
                restingInteval: null
            }
            const res = await saveExercisesBlockAmrap(request)
            this.redirectToParentRoutine(res.data.routineId)
        } catch (e) {
            console.log(e)
        }
    }

    async saveExercisesBlockCombo() {
        try {
            const {exercises, laps, blockName, planificationId, routineId} = this.state
            this.setState({saving: true})

            const request = {
                planificationId: parseInt(planificationId,10),
                routineId: !!routineId ? parseInt(routineId,10) : null,
                blockName: blockName,
                exercises: exercises.map(e => ({id:e.key, name:e.text})),
                laps: parseInt(laps, 10),
            }
            const res = await saveExercisesBlockCombo(request)
            this.redirectToParentRoutine(res.data.routineId)
        } catch (e) {
            console.log(e)
        }
    }

    async saveExerciseBlockPir() {
        try {
            const {exercises, laps, blockName, planificationId, routineId} = this.state
            this.setState({saving: true})

            const request = {
                planificationId: parseInt(planificationId,10),
                routineId: !!routineId ? parseInt(routineId,10) : null,
                blockName: blockName,
                exercises: exercises.map(e => ({id:e.key, name:e.text, reps: e.reps})),
                laps: parseInt(laps, 10),
            }
            const res = await saveExerciseBlockPir(request)
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
        const {
            exercisesBuffer,
            blockName,
            defaultPiramidTop,
            defaultIncrementPerSerie,
            defaultPiramidSeries
        } = this.state;

        if (id === 'pir') {
            exercisesBuffer.splice(1)
            exercisesBuffer[0].reps = defaultPiramidTop
            for (let i = 1; i < defaultPiramidSeries; i++) {
                exercisesBuffer.push({...exercisesBuffer[0], reps: exercisesBuffer[i-1].reps-defaultIncrementPerSerie})
            }
        }

        this.setState({showModal: false, blockType: id, exercises: [...exercisesBuffer], exercisesBuffer: [], blockName: blockName+': '+name})
    }

    repeatExercise(item, atTop) {
        const {
            exercises,
            defaultIncrementPerSerie
        } = this.state;
        if (atTop) {
            const buffer = {...item}
            buffer.reps += defaultIncrementPerSerie
            this.setState({exercises: [buffer, ...exercises]})
        } else {
            this.setState({exercises: [...exercises, item]})
        }
    }

    moveUp(currentIndex){
        if (currentIndex === 0) {
            return
        }
        const {exercises} = this.state;
        const buffer = [...exercises]
        const previousExercise = buffer[currentIndex-1]
        const currentExercise = buffer[currentIndex]
        buffer[currentIndex] = previousExercise
        buffer[currentIndex-1] = currentExercise
        this.setState({exercises: [...buffer], currentSelectedIndex: currentIndex-1})
    }

    moveDown(currentIndex){
        const {exercises} = this.state;
        if (currentIndex === exercises.length-1) {
            return
        }
        const buffer = [...exercises]
        const nextExercise = buffer[currentIndex+1]
        const currentExercise = buffer[currentIndex]
        buffer[currentIndex] = nextExercise
        buffer[currentIndex+1] = currentExercise
        this.setState({exercises: [...buffer], currentSelectedIndex: currentIndex+1})
    }

    renderBlockTypeUI() {
        const {blockType, lapRestDefault, exercises, next, currentSelectedIndex} = this.state;

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
            case 'amrap':
                return (
                    <>
                        <List>
                            {
                                exercises.map((i, index) => {
                                    return (<ExerciseListItem focus={index===next} key={index} item={i} finished={(reps) => this.saveExercise(i, reps)}/>)
                                })
                            }
                        </List>
                        <Divider hidden/>
                        <Segment textAlign='center'>
                            <InputNumber label={'Duracion (Minutos)'} minutes large onChange={({amount}) => this.setState({blockDuration: amount})}/>
                        </Segment>
                        <Button.Group fluid>
                            <Button secondary onClick={() => this.props.history.goBack()}>Cancelar</Button>
                            <Button primary onClick={() => this.saveExercisesBlockAmrap()}>Guardar</Button>
                        </Button.Group>
                    </>
                )
            case 'cbo':
                return (
                    <>
                        <List>
                            {
                                exercises.map((i, index) => {
                                    return (<ExerciseListItemCombo
                                        key={index}
                                        item={i}
                                        selected={currentSelectedIndex === index}
                                        onRepeat={(item) => this.repeatExercise(item)}
                                        moveUp={() => this.moveUp(index)}
                                        moveDown={() => this.moveDown(index)}
                                    />)
                                })
                            }
                        </List>
                        <Divider hidden/>
                        <Segment textAlign='center'>
                            <Divider horizontal>Rondas</Divider>
                            <InputNumber large onChange={({amount}) => this.setState({laps: amount})}/>
                        </Segment>
                        <Button.Group fluid>
                            <Button secondary onClick={() => this.props.history.goBack()}>Cancelar</Button>
                            <Button primary onClick={() => this.saveExercisesBlockCombo()}>Guardar</Button>
                        </Button.Group>
                    </>
                )
            case 'pir':
                return (
                    <>
                        <List>
                            {
                                exercises.map((i, index) => {
                                    return (<ExerciseListItem
                                        focus={index===next}
                                        key={index}
                                        item={i}
                                        value={i.reps}
                                        onRepeat={index===0 ? (item) => this.repeatExercise(item, true) : null}
                                        finished={(reps) => this.saveExercise(i, reps)}/>)
                                })
                            }
                        </List>
                        <Divider hidden/>
                        <Segment textAlign='center'>
                            <Divider horizontal>Rondas</Divider>
                            <InputNumber large onChange={({amount}) => this.setState({laps: amount})}/>
                        </Segment>
                        <Button.Group fluid>
                            <Button secondary onClick={() => this.props.history.goBack()}>Cancelar</Button>
                            <Button primary onClick={() => this.saveExerciseBlockPir()}>Guardar</Button>
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
                    </>
                )
        }
    }

    onAddUnexistingExercise(value) {
        const {exercisesBuffer, exerciseOptions, biggerId} = this.state;

        const sanitizedInput = value.replace(/[^a-zA-Z0-9]/g, "");
        const ex = exerciseOptions.find(e => e.comparer === sanitizedInput)

        if (!!ex) {
            exercisesBuffer.push(ex)
            this.setState({exercisesBuffer})
        } else {
            const words = value.split(' ')
            for (let i = 0; i < words.length; i++) {
                const sanitizedWord = words[i].replace(/[^a-zA-Z0-9]/g, "");
                const firstLetter = sanitizedWord[0].toUpperCase()
                const rest = sanitizedWord.substring(1,sanitizedWord.length).toLowerCase()
                words[i] = firstLetter+rest
            }

            const name = words.join(' ')
            const lastBiggerId = biggerId+1
            const exercise = {text: name, key: lastBiggerId, value: lastBiggerId}
            exerciseOptions.push(exercise)
            exercisesBuffer.push(exercise)
            this.setState({exerciseOptions, exercisesBuffer, biggerId: lastBiggerId})
        }
    }

    editBlock() {
        const {defaultBlockName, exercises} = this.state
        this.setState({blockType: null, blockName: defaultBlockName, exercises: [], exercisesBuffer: [...exercises]})
    }

    render() {
        const {blockType, exerciseOptions, exercisesBuffer, blockName, showModal} = this.state;

        return (
            <Segment basic style={{height: '100%'}}>
                <Header as={'h3'}>
                    {blockName}
                    {blockType && <Icon name={'edit outline'} className={'header-icon'} onClick={() => this.editBlock()}/>}
                </Header>
                {
                    !blockType &&
                    <>
                        <Message>
                            <b>No encontras un ejercicio? Agregalo haciendo click en "Agregar"</b>
                            <br/><br/>Necesitas repetir un ejercicio? Podes hacerlo una vez generado el bloque. (Combos)
                        </Message>
                        <div ref={this.dropdownRef}>
                            <Dropdown
                                placeholder='Elegi los ejercicios'
                                fluid
                                multiple
                                search
                                selection
                                allowAdditions
                                additionLabel='Agregar '
                                options={exerciseOptions}
                                value={exercisesBuffer.map(e => e.value)}
                                onChange={this.handleExerciseSelection}
                                openOnFocus={true}
                                onAddItem={(e, { value }) => this.onAddUnexistingExercise(value)}
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