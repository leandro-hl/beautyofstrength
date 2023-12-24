import React, {Component, createRef, useContext, useState} from "react";
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
import {AppContext, setData, showSuccess} from "../context";
import BottomMenuBar from "./BottomMenuBar";
import {ExerciseListItemFree} from "./ExerciseListItemFree";
import {capitalize} from "../functions";
import {Chip} from "./Chip";
import {ExerciseSearch} from "./ExerciseSearch";
import {PopUpContinueEditing} from "./PopUpContinueEditing";
import {PopUpDisabledAction} from "./PopUpDisabledAction";

const MenuHeaderRender = ({
                              blockType,
                              newBlockGroupName,
                              blockName,
                              redirectBackToRoutine,
                              editBlock
                          }) => {
    const name = newBlockGroupName+': '+blockName
    return (
        <>
            <Button className={'header-back-arrow'} icon onClick={() => redirectBackToRoutine()}>
                <Icon name={'arrow left'}/>
            </Button>
            <span>
                {name.length > 20 ? <span>{newBlockGroupName+': '}<br/>{blockName}</span> : name}
            </span>
            {/*todo: Hot fix just for the icon to not break the UI. Real fix: block type is chip and not part of the block name. */}
            {blockType && <Icon
                name={'edit outline'}
                className={'header-icon'}
                style={{position: 'absolute',
                    top: '5px',
                    right: '10px'}}
                onClick={() => editBlock()}/>}
        </>
    )
}

class PageBlockCreate extends Component {
    static contextType = AppContext

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
            //todo: lapRestDefault: 'sec', exeRestDefault: 'sec' seems to not be in use.
            next: 0,
            defaultBlockName: '',
            blockName: '',
            exercises: [],
            lapRestDefault: 'sec',
            exeRestDefault: 'sec'}
    }
    
    redirectBackToRoutine() {
        const {state: {routineId, isTemplate}} = this.context
        if (routineId) {
            this.props.history.push('/routine')
        } else {
            if (isTemplate) {
                this.redirectToSuite()
            } else {
                this.props.history.push('/planification')
            }
        }
    }

    redirectToSuite() {
        this.props.history.push('/suite')
    }

    async componentDidMount() {
        try {
            const {state: {planificationId, routineId, newBlockGroupName, nextWorkNumber, newBlockGroupId, nextBlockNumber}} = this.context
            this.context.dispatch(setData({secondaryActions: []}))
            this.setState({loading: true})

            const defaultBlockName = 'Trabajo '+(nextWorkNumber??1)
            this.setState({
                loading: false,
                planificationId,
                routineId,
                defaultBlockName,
                nextBlockNumber,
                newBlockGroupName: newBlockGroupName,
                newBlockGroupId: newBlockGroupId,
                blockName: defaultBlockName,
            })
            this.setTopBar(newBlockGroupName, defaultBlockName)
        } catch (e) {
            console.error(e)
        }
    }

    componentWillUnmount() {
        this.context.dispatch(setData({secondaryActions: []}))
    }

    setTopBar(newBlockGroupName, blockName, blockType) {
        this.context.dispatch(setData({
            MenuHeaderRender: <MenuHeaderRender
                blockType={blockType ?? this.state.blockType}
                newBlockGroupName={newBlockGroupName ?? this.state.newBlockGroupName}
                blockName={blockName ?? this.state.blockName}
                redirectBackToRoutine={() => this.redirectBackToRoutine()}
                editBlock={() => this.editBlock()}
            />
        }))
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

    restUpdate(type, obj) {
        this.setState({[type]: {...this.state[type], ...obj}})
    }

    redirectToParentRoutine(addedToRoutineId) {
        const {state: {routineId, newBlockGroupDraftIndex, draftBlockGroupers}} = this.context
        let contextData = null
        if (routineId !== addedToRoutineId) {
            contextData = {routineId: addedToRoutineId}
        }

        if (newBlockGroupDraftIndex) {
            const buff = [...draftBlockGroupers]
            buff.splice(newBlockGroupDraftIndex,1)
            if (contextData) {
                contextData.draftBlockGroupers = [...buff]
                contextData.newBlockGroupDraftIndex = null
            } else {
                contextData = {draftBlockGroupers: [...buff], newBlockGroupDraftIndex: null}
            }
        }

        if (contextData) {
            this.context.dispatch(setData(contextData))
        }
        this.context.dispatch(setData({prepareExercises: {data: {exercises: []}}}))
        this.props.history.push('/routine')
    }

    async saveExercisesBlockCpt(isTemplate) {
        try {
            const {exercises, laps, workingInterval, restingInteval, blockName, planificationId, routineId, newBlockGroupName,newBlockGroupId,nextBlockNumber} = this.state
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
                newBlockGroupOrder: nextBlockNumber,
                exercises: exercises.map(e => ({id:e.key, name:e.text})),
                laps: parseInt(laps, 10),
                workingInterval: parseInt(workingInterval, 10),
                restingInteval: parseInt(restingInteval, 10),
                isTemplate
            }
            const res = await saveExercisesBlockCpt(request)
            showSuccess(this.context, '', 'Operacion completada con exito!')
            this.redirectToParentRoutine(res.data.routineId)
        } catch (e) {
            console.log(e)
        }
    }

    async saveExercisesBlockFree(isTemplate) {
        try {
            const {exercises, laps, exeRestingInteval, restingInteval, blockName, planificationId, routineId, newBlockGroupName,newBlockGroupId,nextBlockNumber} = this.state
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
                newBlockGroupOrder: nextBlockNumber,
                exercises: exercises.map(e => ({id:e.key, name:e.text, reps: parseInt(e.reps, 10), type: e.type})),
                laps: parseInt(laps, 10),
                restingInteval: parseInt(restingInteval, 10),
                exeRestingInteval: parseInt(exeRestingInteval, 10),
                isTemplate
            }
            const res = await saveExercisesBlockFree(request)
            showSuccess(this.context, '', 'Operacion completada con exito!')
            this.redirectToParentRoutine(res.data.routineId)
        } catch (e) {
            console.log(e)
        }
    }

    async saveExercisesBlockSpr(isTemplate) {
        await this.saveExercisesBlockFree(isTemplate)
    }

    async saveExercisesBlockAmrap(isTemplate) {
        try {
            const {exercises, blockName, blockDuration, planificationId, routineId,newBlockGroupName, newBlockGroupId,nextBlockNumber} = this.state
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
                newBlockGroupOrder: nextBlockNumber,
                exercises: exercises.map(e => ({id:e.key, name:e.text, reps: parseInt(e.reps, 10)})),
                blockDuration: parseInt(blockDuration,10),
                laps: null,
                workingInterval: null,
                restingInteval: null,
                isTemplate
            }
            const res = await saveExercisesBlockAmrap(request)
            showSuccess(this.context, '', 'Operacion completada con exito!')
            this.redirectToParentRoutine(res.data.routineId)
        } catch (e) {
            console.log(e)
        }
    }

    async saveExercisesBlockCombo(isTemplate) {
        try {
            const {exercises, laps, blockName, planificationId, routineId,newBlockGroupName,newBlockGroupId,nextBlockNumber} = this.state
            this.setState({saving: true})

            const request = {
                planificationId: parseInt(planificationId,10),
                routineId: !!routineId ? parseInt(routineId,10) : null,
                blockName: blockName,
                newBlockGroupName,
                newBlockGroupId,
                newBlockGroupOrder: nextBlockNumber,
                exercises: exercises.map(e => ({id:e.key, name:e.text})),
                laps: parseInt(laps, 10),
                isTemplate
            }
            const res = await saveExercisesBlockCombo(request)
            showSuccess(this.context, '', 'Operacion completada con exito!')
            this.redirectToParentRoutine(res.data.routineId)
        } catch (e) {
            console.log(e)
        }
    }

    async saveExerciseBlockPir(isTemplate) {
        try {
            const {exercises, laps, blockName, planificationId, routineId,newBlockGroupName,newBlockGroupId,nextBlockNumber} = this.state
            this.setState({saving: true})

            const request = {
                planificationId: parseInt(planificationId,10),
                routineId: !!routineId ? parseInt(routineId,10) : null,
                blockName: blockName,
                newBlockGroupName,
                newBlockGroupId,
                newBlockGroupOrder: nextBlockNumber,
                exercises: exercises.map(e => ({id:e.key, name:e.text, reps: parseInt(e.reps, 10)})),
                laps: parseInt(laps, 10),
                isTemplate
            }
            const res = await saveExerciseBlockPir(request)
            showSuccess(this.context, '', 'Operacion completada con exito!')
            this.redirectToParentRoutine(res.data.routineId)
        } catch (e) {
            console.log(e)
        }
    }

    generateBlockTypeUI(id, name) {
        const {state: {isTemplate}} = this.context
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
                secondaryActions[0].func = () => this.saveExercisesBlockFree(isTemplate)
                break
            case 'spr':
                secondaryActions[0].func = () => this.saveExercisesBlockSpr(isTemplate)
                break
            case 'cpt':
                secondaryActions[0].func = () => this.saveExercisesBlockCpt(isTemplate)
                break
            case 'amrap':
                secondaryActions[0].func = () => this.saveExercisesBlockAmrap(isTemplate)
                break
            case 'cbo':
                secondaryActions[0].func = () => this.saveExercisesBlockCombo(isTemplate)
                break
            case 'pir':
                secondaryActions[0].func = () => this.saveExerciseBlockPir(isTemplate)
                //if there were multiple exercises selected only the first one is considered valid
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
        const newBlockName = blockName+' - '+name
        this.setState({showModal: false, blockType: id, exercises: [...exercisesBuffer], exercisesBuffer: [], blockName: newBlockName})
        this.setTopBar(null, newBlockName, id)
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

    editBlock() {
        const {defaultBlockName, exercises} = this.state
        this.context.dispatch(setData({secondaryActions: []}))
        this.setState({blockType: null, blockName: defaultBlockName, exercises: [], exercisesBuffer: [...exercises]})
        this.setTopBar(null, defaultBlockName, null)
    }

    render() {
        const {state: {permissions: {createNewExercises}}} = this.context
        const {blockType, exercisesBuffer, showModal} = this.state;

        return (
            <>
                {
                    !blockType &&
                    <>
                        <div className={'scrolling-no-scrollbar'} style={{height: '90%'}}>
                            {createNewExercises && <Message>
                                <b>No encontras un ejercicio? Agregalo haciendo click en "Agregar"</b>
                            </Message>}
                            <Button style={{marginBottom: '1em'}} primary fluid onClick={() => this.setState({showModal: true})}>Generar</Button>
                            <ExerciseSearch
                                defaultSelected={exercisesBuffer}
                                allowAdditions={createNewExercises}
                                onSelected={(selected) => this.setState({exercisesBuffer: selected})}
                            />
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