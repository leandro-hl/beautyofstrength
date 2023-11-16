import React, {Component, createRef} from "react";
import {Button, Divider, Dropdown, Grid, Header, Icon, Input, Label, List, Message, Segment} from "semantic-ui-react";
import {ExerciseListItem} from "./ExerciseListItem";
import {RestInput} from "./RestInput";
import {
    listExercises, saveExerciseBlockPir,
    saveExercisesBlock,
    saveExercisesBlockAmrap,
    saveExercisesBlockCombo,
    saveExercisesBlockCpt, saveExercisesBlockFree,
    signIn
} from "../service";
import {withRouter} from "react-router-dom";
import {ModalTrainingBlockType} from "./ModalTrainingBlockType";
import {ExerciseListItemCircuitInterval} from "./ExerciseListItemCircuitInterval";
import {InputNumber} from "./InputNumber";
import {ExerciseListItemCombo} from "./ExerciseListItemCombo";
import {AppContext, setData} from "../context";
import BottomMenuBar from "./BottomMenuBar";
import {ExerciseListItemFree} from "./ExerciseListItemFree";
import {capitalize} from "../functions";

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
    
    redirectBackToRoutine() {
        const {state: {routineId}} = this.context
        if (routineId) {
            this.props.history.push('/routine')
        } else {
            this.props.history.push('/planification')
        }
    }

    async componentDidMount() {
        try {
            const {state: {planificationId, routineId, newBlockGroupName, nextWorkNumber, newBlockGroupId}} = this.context
            this.context.dispatch(setData({secondaryActions: []}))
            this.setState({loading: true})
            const res = await listExercises()
            let biggerId = 0
            for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].id > biggerId) {
                    biggerId = res.data[i].id
                }
            }
            const defaultBlockName = 'Trabajo '+(nextWorkNumber??1)
            this.setState({
                loading: false,
                biggerId,
                planificationId,
                routineId,
                defaultBlockName,
                newBlockGroupName: newBlockGroupName,
                newBlockGroupId: newBlockGroupId,
                blockName: defaultBlockName,
                exerciseOptions: res.data.map(e => ({key: e.id, value:e.id, text:e.name, createdbyuser: e.createdbyuser.toLowerCase(), comparer: e.name.toLowerCase().trim().replaceAll(' ', '')}))})
        } catch (e) {
            console.error(e)
        }
    }

    componentWillUnmount() {
        this.context.dispatch(setData({secondaryActions: []}))
    }

    saveExercise(i, reps, goNext) {
        const {exercises} = this.state
        const index = exercises.indexOf(i)
        exercises[index].reps = reps

        if (goNext) {
            this.setState({exercises, next: index+1})
        } else {
            this.setState({exercises, next: index})
        }
    }

    onIntervalSelected(i, val) {
        const {exercises} = this.state
        const index = exercises.indexOf(i)
        exercises[index].type = val
        this.setState({exercises})
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
            const {exercises, laps, workingInterval, restingInteval, blockName, planificationId, routineId, newBlockGroupName,newBlockGroupId} = this.state
            this.setState({saving: true})

            if(!workingInterval || !restingInteval || !laps) {
                //todo required validation.
            }

            const request = {
                planificationId: parseInt(planificationId,10),
                routineId: !!routineId ? parseInt(routineId,10) : null,
                blockName: blockName,
                newBlockGroupName,
                newBlockGroupId,
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

    async saveExercisesBlockFree() {
        try {
            const {exercises, laps, exeRestingInteval, restingInteval, blockName, planificationId, routineId, newBlockGroupName,newBlockGroupId} = this.state
            this.setState({saving: true})

            if(!exeRestingInteval || !restingInteval || !laps) {
                //todo required validation.
            }

            const request = {
                planificationId: parseInt(planificationId,10),
                routineId: !!routineId ? parseInt(routineId,10) : null,
                blockName: blockName,
                newBlockGroupName,
                newBlockGroupId,
                exercises: exercises.map(e => ({id:e.key, name:e.text, reps: parseInt(e.reps, 10), type: e.type})),
                laps: parseInt(laps, 10),
                restingInteval: parseInt(restingInteval, 10),
                exeRestingInteval: parseInt(exeRestingInteval, 10)
            }
            const res = await saveExercisesBlockFree(request)
            this.redirectToParentRoutine(res.data.routineId)
        } catch (e) {
            console.log(e)
        }
    }

    async saveExercisesBlockSpr() {
        await this.saveExercisesBlockFree()
    }

    async saveExercisesBlockAmrap() {
        try {
            const {exercises, blockName, blockDuration, planificationId, routineId,newBlockGroupName, newBlockGroupId} = this.state
            this.setState({saving: true})

            if(!blockDuration) {
                //todo required validation.
            }

            const request = {
                planificationId: parseInt(planificationId,10),
                routineId: !!routineId ? parseInt(routineId,10) : null,
                blockName: blockName,
                newBlockGroupName,
                newBlockGroupId,
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
            const {exercises, laps, blockName, planificationId, routineId,newBlockGroupName,newBlockGroupId} = this.state
            this.setState({saving: true})

            const request = {
                planificationId: parseInt(planificationId,10),
                routineId: !!routineId ? parseInt(routineId,10) : null,
                blockName: blockName,
                newBlockGroupName,
                newBlockGroupId,
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
            const {exercises, laps, blockName, planificationId, routineId,newBlockGroupName,newBlockGroupId} = this.state
            this.setState({saving: true})

            const request = {
                planificationId: parseInt(planificationId,10),
                routineId: !!routineId ? parseInt(routineId,10) : null,
                blockName: blockName,
                newBlockGroupName,
                newBlockGroupId,
                exercises: exercises.map(e => ({id:e.key, name:e.text, reps: parseInt(e.reps, 10)})),
                laps: parseInt(laps, 10),
            }
            const res = await saveExerciseBlockPir(request)
            this.redirectToParentRoutine(res.data.routineId)
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

        const secondaryActions = [
            {func: () => {}, description: 'Guardar'},
        ]

        switch (id) {
            case 'free':
                secondaryActions[0].func = () => this.saveExercisesBlockFree()
                break
            case 'spr':
                secondaryActions[0].func = () => this.saveExercisesBlockSpr()
                break
            case 'cpt':
                secondaryActions[0].func = () => this.saveExercisesBlockCpt()
                break
            case 'amrap':
                secondaryActions[0].func = () => this.saveExercisesBlockAmrap()
                break
            case 'cbo':
                secondaryActions[0].func = () => this.saveExercisesBlockCombo()
                break
            case 'pir':
                secondaryActions[0].func = () => this.saveExerciseBlockPir()
                exercisesBuffer.splice(1)
                exercisesBuffer[0].reps = defaultPiramidTop
                for (let i = 1; i < defaultPiramidSeries; i++) {
                    exercisesBuffer.push({...exercisesBuffer[0], reps: exercisesBuffer[i-1].reps-defaultIncrementPerSerie})
                }
                break
            default:
                console.error('invalid or unsupported block type')
        }

        this.context.dispatch(setData({secondaryActions: secondaryActions}))
        this.setState({showModal: false, blockType: id, exercises: [...exercisesBuffer], exercisesBuffer: [], blockName: blockName+' - '+name})
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

    renderFree(blockType, lapRestDefault, exercises, next, currentSelectedIndex) {
        return (
            <>
                <List>
                    {
                        exercises.map((i, index) => {
                            return (<ExerciseListItemFree
                                key={index}
                                item={i}
                                focus={index===next}
                                selected={currentSelectedIndex === index}
                                finished={(reps, goNext) => this.saveExercise(i, reps, goNext)}
                                onRepeat={(item) => this.repeatExercise(item)}
                                moveUp={() => this.moveUp(index)}
                                moveDown={() => this.moveDown(index)}
                                onIntervalSelected={(val) => this.onIntervalSelected(i,val)}
                            />)
                        })
                    }
                </List>
                <Divider hidden/>
                <Segment textAlign='center'>
                    <Divider horizontal>Descanso Entre Ejercicios<br/>(Segundos)</Divider>
                    <InputNumber seconds large onChange={({amount}) => this.setState({exeRestingInteval: amount, next: null})}/>
                    <Divider horizontal>Rondas</Divider>
                    <InputNumber large onChange={({amount}) => this.setState({laps: amount, next: null})}/>
                    <Divider horizontal>Descanso Entre Rondas<br/>(Segundos)</Divider>
                    <InputNumber seconds large onChange={({amount}) => this.setState({restingInteval: amount, next: null})}/>
                </Segment>
            </>
        )
    }

    renderBlockTypeUI() {
        const {blockType, lapRestDefault, exercises, next, currentSelectedIndex} = this.state;

        switch (blockType) {
            case 'free':
                return this.renderFree(blockType, lapRestDefault, exercises, next, currentSelectedIndex)
            case 'spr':
                return this.renderFree(blockType, lapRestDefault, exercises, next, currentSelectedIndex)
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
                                        <InputNumber label={'Trabajo'} seconds large onChange={({amount}) => this.setState({workingInterval: amount, next: null})}/>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <InputNumber label={'Descanso'} seconds large onChange={({amount}) => this.setState({restingInteval: amount, next: null})}/>
                                    </Grid.Column>
                                </Grid>
                                <Divider vertical>X</Divider>
                            </Segment>
                            <Divider horizontal>Rondas</Divider>
                            <InputNumber large onChange={({amount}) => this.setState({laps: amount, next: null})}/>
                        </Segment>
                    </>
                )
            case 'amrap':
                return (
                    <>
                        <List>
                            {
                                exercises.map((i, index) => {
                                    return (<ExerciseListItem focus={index===next} key={index} item={i} finished={(reps, goNext) => this.saveExercise(i, reps, goNext)}/>)
                                })
                            }
                        </List>
                        <Divider hidden/>
                        <Segment textAlign='center'>
                            <InputNumber label={'Duracion (Minutos)'} minutes large onChange={({amount}) => this.setState({blockDuration: amount, next: null})}/>
                        </Segment>
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
                            <InputNumber large onChange={({amount}) => this.setState({laps: amount, next: null})}/>
                        </Segment>
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
                            <InputNumber large onChange={({amount}) => this.setState({laps: amount, next: null})}/>
                        </Segment>
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
                    </>
                )
        }
    }

    onAddUnexistingExercise(value) {
        const {exercisesBuffer, exerciseOptions, biggerId} = this.state;

        const regex = /[^a-zA-Z0-9áéíóúüÁÉÍÓÚÜÑñ/]/g
        const sanitizedInput = value.replace(regex, "");
        const ex = exerciseOptions.find(e => e.comparer === sanitizedInput)

        if (!!ex) {
            exercisesBuffer.push(ex)
            this.setState({exercisesBuffer})
        } else {
            const words = value.split(' ')
            for (let i = 0; i < words.length; i++) {
                const sanitizedWord = words[i].replace(regex, "");
                words[i] = capitalize(sanitizedWord)
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
        this.context.dispatch(setData({secondaryActions: []}))
        this.setState({blockType: null, blockName: defaultBlockName, exercises: [], exercisesBuffer: [...exercises]})
    }

    render() {
        const {state: {permissions: {createNewExercises}}} = this.context
        const {blockType, exerciseOptions, exercisesBuffer,newBlockGroupName, blockName, showModal} = this.state;

        return (
            <>
                <Header as={'h3'}>
                    <Button className={'header-back-arrow'} icon onClick={() => this.redirectBackToRoutine()}>
                        <Icon name={'arrow left'}/>
                    </Button>
                    {newBlockGroupName+': '+blockName}
                    {blockType && <Icon name={'edit outline'} className={'header-icon'} onClick={() => this.editBlock()}/>}
                </Header>
                {
                    !blockType &&
                    <>
                        <div className={'scrolling-no-scrollbar'} style={{height: '90%'}}>
                            {createNewExercises && <Message>
                                <b>No encontras un ejercicio? Agregalo haciendo click en "Agregar"</b>
                            </Message>}
                            <Button style={{marginBottom: '1em'}} primary fluid onClick={() => this.setState({showModal: true})}>Generar</Button>
                            <div ref={this.dropdownRef}>
                                <Dropdown
                                    placeholder='Elegi los ejercicios'
                                    fluid
                                    multiple
                                    search
                                    selection
                                    allowAdditions={createNewExercises}
                                    additionLabel='Agregar '
                                    onAddItem={(e, { value }) => this.onAddUnexistingExercise(value)}
                                    options={exerciseOptions}
                                    value={exercisesBuffer.map(e => e.value)}
                                    onChange={this.handleExerciseSelection}
                                    openOnFocus={true}
                                    tabIndex={0}
                                    noResultsMessage={'No se encontro el ejercicio'}
                                    selectOnBlur={false}
                                />
                            </div>
                            <Divider hidden/>
                        </div>
                    </>
                }
                {blockType && this.renderBlockTypeUI()}
                <ModalTrainingBlockType showModal={showModal} onClose={() => this.setState({showModal: false})} onTypeSelected={(id, name) => this.generateBlockTypeUI(id, name)}/>
            </>
        )
    }
}

export default withRouter(PageBlockCreate);