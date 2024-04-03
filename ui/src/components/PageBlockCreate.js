import React, {Component, createRef, useContext, useState} from "react";
import {
    Button,
    Checkbox,
    Divider,
    Dropdown,
    Grid,
    Header,
    Icon,
    Input,
    Label,
    List,
    Message,
    Segment
} from "semantic-ui-react";
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
                              redirectBackToRoutine,
                              editBlock,
                              onExerciseSelected
                          }) => {
    return (
        // <Grid>
        //     <Grid.Row>
        //         <Grid.Column width={1} className={'no-padding'}>
        //             <Button className={'header-back-arrow'} icon onClick={() => redirectBackToRoutine()}>
        //                 <Icon name={'arrow left'}/>
        //             </Button>
        //         </Grid.Column>
        //         <Grid.Column width={14} className={'no-padding'}>
        //             <ExerciseSearch alwaysClear={true} onSelected={(selected) => onExerciseSelected(selected)}/>
        //         </Grid.Column>
        //         {/*<Grid.Column>*/}
        //         {/*    /!*todo: Hot fix just for the icon to not break the UI. Real fix: block type is chip and not part of the block name. *!/*/}
        //         {/*    {blockType && <Icon*/}
        //         {/*        name={'edit outline'}*/}
        //         {/*        className={'header-icon'}*/}
        //         {/*        style={{*/}
        //         {/*            position: 'absolute',*/}
        //         {/*            top: '5px',*/}
        //         {/*            right: '10px'*/}
        //         {/*        }}*/}
        //         {/*        onClick={() => editBlock()}/>}*/}
        //         {/*</Grid.Column>*/}
        //     </Grid.Row>
        // </Grid>
        <>
            <Button className={'header-back-arrow'} icon onClick={() => redirectBackToRoutine()}>
                 <Icon name={'arrow left'}/>
             </Button>
            {/*<ExerciseSearch alwaysClear={true} onSelected={(selected) => onExerciseSelected(selected)}/>*/}
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
            blockType: 'free',
            //todo: lapRestDefault: 'sec', exeRestDefault: 'sec' seems to not be in use.
            next: 0,
            defaultBlockName: '',
            blockName: '',
            exercisesBuffer:[],
            exercises: [{}],
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

            const rawOptions = [
                {id: 'free', name: 'LIBRE'},
                {id: 'spr', name: 'SERIE POR REPETICIONES'},
                {id: 'cpt', name: 'CIRCUITO POR INTERVALOS'},
                {id: 'amrap', name: 'AMRAP'},
                {id: 'cbo', name: 'COMBO'},
                {id: 'pir', name: 'PIRAMIDE REPETICIONES'},
                {id: 'emom', name: 'EMOM'},
                {id: 'hiit', name: 'HIIT'},
                {id: 'drop', name: 'DROP SET'},
            ]
            const selectedBlockTypeOption = rawOptions[0]

            this.setState({
                loading: false,
                planificationId,
                routineId,
                defaultBlockName,
                nextBlockNumber,
                newBlockGroupName,
                newBlockGroupId: newBlockGroupId,
                blockTypeOptions: rawOptions.map(e => ({key: e.id, value: e.id, text: e.name})),
                blockName: defaultBlockName,
                blockType: selectedBlockTypeOption.id,
            })
            this.generateBlockTypeUI(selectedBlockTypeOption.id)
        } catch (e) {
            console.error(e)
        }
    }

    componentWillUnmount() {
        this.context.dispatch(setData({secondaryActions: []}))
    }

    onExerciseSelected(index, selected) {
        const {exercises} = this.state
        exercises[index] = {...selected[selected.length - 1], hideAddNext: exercises[index].hideAddNext}
        this.setState({exercises});
    }

    onAddExcercise(index) {
        const {exercises} = this.state
        exercises[index].hideAddNext=true
        exercises.push({})
        this.setState({exercises})
    }

    setTopBar() {
        this.context.dispatch(setData({
            MenuHeaderRender: <MenuHeaderRender
                redirectBackToRoutine={() => this.redirectBackToRoutine()}
                // editBlock={() => this.editBlock()}
                onExerciseSelected={(selected) => this.onExerciseSelected(selected)}/>
        }))
    }

    saveExercise(index, series, reps, goNext) {
        const {exercises} = this.state
        exercises[index].reps = reps
        exercises[index].series = series

        if (goNext) {
            this.setState({exercises, next: index+1})
        } else {
            this.setState({exercises, next: index})
        }
    }

    onIntervalSelected(index, val) {
        const {exercises} = this.state
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
            const {exercises, laps, blockType, workingInterval, restingInteval, blockName, planificationId, routineId, newBlockGroupName,newBlockGroupId,nextBlockNumber} = this.state
            this.setState({saving: true})

            const request = {
                planificationId: parseInt(planificationId,10),
                routineId: !!routineId ? parseInt(routineId,10) : null,
                blockName: blockName+' - '+blockType,
                blockType: blockType,
                newBlockGroupName,
                newBlockGroupId,
                newBlockGroupOrder: nextBlockNumber,
                exercises: exercises.filter(e=>e.key).map(e => ({id:e.key, name:e.text, series: parseInt(e.series, 10), reps: parseInt(e.reps, 10), type: e.type})),
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
            const {exercises, laps, exeRestingInteval, restingInteval, blockName, blockType, planificationId, routineId, newBlockGroupName,newBlockGroupId,nextBlockNumber} = this.state
            this.setState({saving: true})

            const request = {
                blockType: blockType,
                planificationId: parseInt(planificationId,10),
                routineId: !!routineId ? parseInt(routineId,10) : null,
                //todo: refactor to have block type outside name
                blockName: blockName+' - '+blockType,
                newBlockGroupName,
                newBlockGroupId,
                newBlockGroupOrder: nextBlockNumber,
                exercises: exercises.filter(e=>e.key).map(e => ({id:e.key, name:e.text, series: parseInt(e.series, 10), reps: parseInt(e.reps, 10), type: e.type})),
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
            const {exercises, blockName,blockType, blockDuration, planificationId, routineId,newBlockGroupName, newBlockGroupId,nextBlockNumber} = this.state
            this.setState({saving: true})

            if(!blockDuration) {
                //todo required validation.
            }

            const request = {
                planificationId: parseInt(planificationId,10),
                routineId: !!routineId ? parseInt(routineId,10) : null,
                blockName: blockName+' - '+blockType,
                blockType: blockType,
                newBlockGroupName,
                newBlockGroupId,
                newBlockGroupOrder: nextBlockNumber,
                exercises: exercises.filter(e=>e.key).map(e => ({id:e.key, name:e.text, series: parseInt(e.series, 10), reps: parseInt(e.reps, 10), type: e.type})),
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
            const {exercises, laps, blockType, blockName, planificationId, routineId,newBlockGroupName,newBlockGroupId,nextBlockNumber} = this.state
            this.setState({saving: true})

            const request = {
                planificationId: parseInt(planificationId,10),
                routineId: !!routineId ? parseInt(routineId,10) : null,
                blockName: blockName+' - '+blockType,
                blockType: blockType,
                newBlockGroupName,
                newBlockGroupId,
                newBlockGroupOrder: nextBlockNumber,
                exercises: exercises.filter(e=>e.key).map(e => ({id:e.key, name:e.text, series: parseInt(e.series, 10), reps: parseInt(e.reps, 10), type: e.type})),
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
            const {exercises, laps, blockType, blockName, planificationId, routineId,newBlockGroupName,newBlockGroupId,nextBlockNumber} = this.state
            this.setState({saving: true})

            const request = {
                planificationId: parseInt(planificationId,10),
                routineId: !!routineId ? parseInt(routineId,10) : null,
                blockName: blockName+' - '+blockType,
                newBlockGroupName,
                newBlockGroupId,
                newBlockGroupOrder: nextBlockNumber,
                exercises: exercises.filter(e=>e.key).map(e => ({id:e.key, name:e.text, reps: parseInt(e.reps, 10)})),
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

    generateBlockTypeUI(blockType) {
        const {state: {isTemplate}} = this.context

        const secondaryActions = [
            {func: () => {}, description: 'Guardar'},
        ]

        switch (blockType) {
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
                break
            default:
                secondaryActions[0].func = () => this.saveExercisesBlockFree(isTemplate)
                break
        }

        this.setTopBar()
        this.context.dispatch(setData({secondaryActions: secondaryActions}))
    }

    repeatExercise(item, atTop, index) {
        const {
            exercises,
            defaultIncrementPerSerie
        } = this.state;
        const buffer = {...item}
        if (atTop) {
            buffer.reps += defaultIncrementPerSerie
            this.setState({exercises: [buffer, ...exercises]})
        } else if(index !== undefined) {
            exercises.splice(index, 0, buffer)
            this.setState({exercises: [...exercises]})
        }
        else {
            this.setState({exercises: [...exercises, buffer]})
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

    renderFree() {
        return (
            <>
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
        const {blockType} = this.state;

        switch (blockType) {
            case 'free':
                return this.renderFree()
            case 'spr':
                return this.renderFree()
            case 'cpt':
                return (
                    <>
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
                        <Divider hidden/>
                        <Segment textAlign='center'>
                            <InputNumber label={'Duracion (Minutos)'} minutes large onChange={({amount}) => this.setState({blockDuration: amount, next: null})}/>
                        </Segment>
                    </>
                )
            case 'cbo':
                return (
                    <>
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
                        <Divider hidden/>
                        <Segment textAlign='center'>
                            <Divider horizontal>Rondas</Divider>
                            <InputNumber large onChange={({amount}) => this.setState({laps: amount, next: null})}/>
                        </Segment>
                    </>
                )
            default:
                return this.renderFree()
        }
    }

    editBlock() {
        const {defaultBlockName, exercises} = this.state
        this.context.dispatch(setData({secondaryActions: []}))
        this.setState({blockType: null, blockName: defaultBlockName, exercises: [], exercisesBuffer: [...exercises]})
        this.setTopBar()
    }

    render() {
        const {state: {permissions: {createNewExercises}}} = this.context
        const {blockType,
            exercisesBuffer,
            showModal,
            lapRestDefault,
            blockTypeOptions,
            exercises, next, currentSelectedIndex
        } = this.state;
        const newBlockGroupName=this.state.newBlockGroupName
        const blockName=this.state.blockName ?? this.state.defaultBlockName
        const name = newBlockGroupName + ': ' + blockName
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
                {
                    blockType &&
                    <>
                        <Header as={'h3'}>
                            {name}
                            <Dropdown
                                options={blockTypeOptions}
                                value={blockType}
                                fluid
                                onChange={(e, input) => {
                                    this.setState({blockType: input.value})
                                    this.generateBlockTypeUI(input.value)
                                }}
                                openOnFocus={true}
                                tabIndex={0}
                                selectOnBlur={false}/>
                        </Header>
                        <Segment>
                            <Checkbox
                                slider={true}
                                label={'1 serie'}
                                onChange={(e,{checked}) => {
                                    const {exercises} = this.state;
                                    for (let i = 0; i < exercises.length; i++) {
                                        exercises[i].series = 1
                                    }
                                    this.setState({exercises, defaultSeries: checked})
                                }} checked={this.state.defaultSeries}/>
                            {
                                exercises.map((e, index) => {
                                    return (<ExerciseListItemFree
                                        onExerciseSelected={(selected)=> this.onExerciseSelected(index, selected)}
                                        onAddExercise={() => this.onAddExcercise(index)}
                                        hideAddNext={e.hideAddNext}
                                        disableSeries={this.state.defaultSeries}
                                        key={index}
                                        item={e}
                                        focus={index===next}
                                        selected={currentSelectedIndex === index}
                                        finished={(series, reps, goNext) => this.saveExercise(index, series, reps, goNext)}
                                        onRepeat={(item) => this.repeatExercise(item, false, index)}
                                        moveUp={() => this.moveUp(index)}
                                        moveDown={() => this.moveDown(index)}
                                        onIntervalSelected={(val) => this.onIntervalSelected(index,val)}
                                    />)
                                })
                            }
                        </Segment>
                        {this.renderBlockTypeUI()}
                    </>

                }
                <ModalTrainingBlockType showModal={showModal} onClose={() => this.setState({showModal: false})} onTypeSelected={(id, name) => this.generateBlockTypeUI('broken',id, name)}/>
            </>
        )
    }
}

export default withRouter(PageBlockCreate);