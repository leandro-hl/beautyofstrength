import React, {Component} from "react";
import {
    Accordion,
    Button,
    Divider, Grid,
    Header,
    Icon,
    Input, Label,
    List,
    Loader, Message, Modal,
    Popup,
    Radio,
    Segment,
    Table
} from "semantic-ui-react";
import {Link, withRouter} from "react-router-dom";
import {
    getRoutineDetails,
    getSharedRoutineDetails,
    saveRoutineEditions,
    saveSharedRoutine,
    shareRoutine
} from "../service";
import {AppContext, setData, showSuccess} from "../context";
import BottomMenuBar from "./BottomMenuBar";
import LayoutMobile from "./LayoutMobile";
import {capitalize, isLocalhost, queryParam} from "../functions";
import {MENU} from "../enums";
import {PopUpDisabledAction} from "./PopUpDisabledAction";
import {ModalBlockCreate} from "./ModalBlockCreate";
import {Chip} from "./Chip";
import {PopUpContinueEditing} from "./PopUpContinueEditing";
import {PopUpConfirmation} from "./PopUpConfirmation";
import {ExerciseSearch} from "./ExerciseSearch";
import {SegRepsButtonGroup} from "./SegRepsButtonGroup";

class PageRoutineDetail extends Component{
    static contextType = AppContext

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            name: '',
            blocks: [],
            planificationId: null,
            routineId: null,
            canBeSaved:false,
            activeIndexes:[],
            activeDraftExercise: {
                type: 'reps',
                ex: []
            }
        }
    }

    async componentDidMount() {
        try {
            let share = localStorage.getItem('routine-shared')
            localStorage.removeItem('routine-shared')
            const isShared = false
            if (!share) {
                share = queryParam(this.props, 'share')
            } else {
                if (!queryParam(this.props, 'share')) {
                    this.props.history.replace('/routine?share='+share)
                }
            }

            if (!!share) {
                const res = await getSharedRoutineDetails(share)
                this.context.dispatch(setData({
                    secondaryActions: [],
                    noBottomBar: false,
                    menuButtonSelected: MENU.PLANIFICATIONS,
                    nextBlockNumber: res.data.blockGroupers.length+1}))
                this.context.dispatch(setData({routineId: res.data.id, shared: true}, true))
                this.setState({
                    loading: false,
                    isShared: !isShared,
                    canBeSaved: res.data.canBeSaved,
                    routineId: res.data.id,
                    blockGroupers: res.data.blockGroupers,
                    name: res.data.name,
                    isCopy: res.data.isCopy,
                    alreadyCopied: res.data.alreadyCopied,
                    difficulty: res.data.difficulty,
                    duration: res.data.duration,
                    nextBlockNumber: res.data.blockGroupers.length+1})
            } else {
                await this.refresh()
            }
        } catch (e) {
            console.error(e)
        }
    }

    async refresh() {
        const {state: {routineId, planificationId, isOwner, draftBlockGroupers}} = this.context
        const res = await getRoutineDetails(routineId);

        const actionable = isOwner
        let canEdit = false
        let backup = {}
        if (actionable) {
            canEdit = !res.data.alreadyMarkedByAthetles
            backup = {
                name: res.data.name,
                blockGroupers: res.data.blockGroupers.map(b => (
                    {
                        ...b,
                        blocks: b.blocks.map(bb => (
                            {
                                ...bb,
                                exercises: bb.exercises.map(e => ({...e}))
                            }
                        ))
                    }
                ))
            }
        }
        this.context.dispatch(setData({
            noBottomBar: false,
            menuButtonSelected: MENU.PLANIFICATIONS,
        }))
        this.context.dispatch(setData({
            nextBlockNumber: res.data.blockGroupers.length+draftBlockGroupers.length+1
        }, true))

        this.setState({
            loading: false,
            backup,
            updates: {},
            planificationId,
            isOwner,
            routineId,
            canEdit,
            isCopy: res.data.isCopy,
            alreadyCopied: res.data.alreadyCopied,
            actionable,
            shared: false,
            alreadyMarkedByAthetles: res.data.alreadyMarkedByAthetles,
            blockGroupers: [...res.data.blockGroupers, ...draftBlockGroupers],
            name: res.data.name,
            difficulty: res.data.difficulty,
            duration: res.data.duration,
            nextBlockNumber: res.data.blockGroupers.length+draftBlockGroupers.length+1})
        this.setSecondaryActions()
    }

    redirectToCreateBlock() {
        this.props.history.push('/block/create')
    }

    redirectToPlanification() {
        this.props.history.push('/planification')
    }

    redirectToPlanifications() {
        this.props.history.push('/my-planifications')
    }

    redirectToRoutineExecution() {
        this.props.history.push('/routine/execution')
    }

    handleActiveBlocks = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndexes } = this.state
        const indexOfIndex = activeIndexes.indexOf(index)
        if (indexOfIndex !== -1) {
            activeIndexes.splice(indexOfIndex, 1)
        } else {
            activeIndexes.push(index)
        }

        this.setState({ activeIndexes: activeIndexes })
    }

    async shareRoutine() {
        let res = {}
        try {
            const {planificationId, routineId, canBeSaved} = this.state
            res = await shareRoutine({canBeSaved, planificationId, routineId})

            if (isLocalhost()) {
                await navigator.clipboard.writeText(`localhost:3000/app${res.data}`);
            } else {
                await navigator.clipboard.writeText(`https://bos.team/app${res.data}`);
            }
            showSuccess(this.context, '', 'Link copiado al portapapeles!')
        } catch (e) {
            console.error(e)
            this.setState({routineLink: `${isLocalhost() ? 'localhost:3000/app' : 'https://bos.team/app'}${res.data}`, showModalCopyLink: true})
        } finally {
            this.setState({showPopUp: false})
        }
    }

    openExerciseVideo(videoCode) {
        this.context.dispatch(setData({videoCode: videoCode}))
    }

    addWorkToGrouper(bg, i) {
        try {
            this.context.dispatch(setData({
                nextWorkNumber: bg.blocks.length+1,
                newBlockGroupName: bg.name,
                newBlockGroupId: bg.id,
                newBlockGroupDraftIndex: bg.draftIndex
            }, true))
            this.redirectToCreateBlock()
        } catch (e) {
            console.error(e)
        }
    }

    addBlock() {
        this.setState({ showCreateBlockModal: true });
    }

    addBlockInMemory() {
        const {state: {draftBlockGroupers}} = this.context
        const {nextBlockNumber, blockGroupers} = this.state
        const buff = [...blockGroupers]
        const buffDraft = [...draftBlockGroupers]
        buff.push({id: null, name: 'Bloque '+nextBlockNumber, draftId: nextBlockNumber, draftIndex: draftBlockGroupers.length, blocks: []})
        buffDraft.push({id: null, name: 'Bloque '+nextBlockNumber, draftId: nextBlockNumber, draftIndex: draftBlockGroupers.length, blocks: []})
        this.setState({blockGroupers: [...buff],  nextBlockNumber: nextBlockNumber+1})
        this.context.dispatch(setData({draftBlockGroupers: [...buffDraft]}))
    }

    addNewBlockGroupConfirm() {
        try {
            const {newBlockName, nextBlockNumber} = this.state
            this.context.dispatch(setData({nextWorkNumber: 1, newBlockGroupName: newBlockName ? newBlockName : 'Bloque '+nextBlockNumber, newBlockGroupId: null}, true))
            this.redirectToCreateBlock()
        } catch (e) {
            console.error(e)
        }
        this.addNewBlockGroupClose();
    }

    addNewBlockGroupClose = () => {
        this.setState({ showCreateBlockModal: false });
    }

    async saveRoutineEditions() {
        try {
            const {planificationId, routineId, activeDraftExercise, updates, blockGroupers} = this.state
            this.setState({savingEditions: true})

            const namesPayload = Object.entries(updates.newGrouperNames ?? []).map(([key, value]) => ({
                id: parseInt(value.id, 10),
                name: value.newName
            }));

            const exercisesToAddPayload = []
            for (let i = 0; i < blockGroupers.length; i++) {
                for (let j = 0; j < blockGroupers[i].blocks.length; j++) {
                    for (let k = 0; k < blockGroupers[i].blocks[j].exercises.length; k++) {
                        if (blockGroupers[i].blocks[j].exercises[k].isDraft) {
                            const ex = blockGroupers[i].blocks[j].exercises[k]
                            exercisesToAddPayload.push({
                                order: k,
                                // name: ex.name,
                                grouperId: ex.grouperId,
                                workoutId: ex.workoutId,
                                exerciseId: ex.exerciseId,
                                [ex.type]: parseInt(ex.amount,10),
                            })
                        }
                    }
                }
            }

            if (activeDraftExercise.ex.length>0) {
                const existingIndex = exercisesToAddPayload.findIndex(e => e.order >= activeDraftExercise.order)
                const item = {
                    order: activeDraftExercise.order,
                    grouperId: activeDraftExercise.grouperId,
                    workoutId: activeDraftExercise.workoutId,
                    exerciseId:activeDraftExercise.ex[0].value,
                    [activeDraftExercise.type]: parseInt(activeDraftExercise.reps,10)
                }
                if (existingIndex !== -1) {
                    exercisesToAddPayload.splice(existingIndex+1,0, item)
                    for (let i = existingIndex+1; i < exercisesToAddPayload.length; i++) {
                        exercisesToAddPayload[i].order = exercisesToAddPayload[i].order + 1
                    }
                } else {
                    exercisesToAddPayload.push(item)
                }
            }

            const grouperIdsToDelete = (updates.grouperIdsToDelete ?? []).map(id => id);

            const workoutsToDeletePayload = Object.entries(updates.workoutsToDelete ?? []).map(([key, value]) => ({
                grouperId: value.grouperId,
                workoutId: value.workoutId
            }));

            const exercisesToDeletePayload = Object.entries(updates.workOutExercisesToDelete ?? []).map(([key, value]) => ({
                grouperId: value.grouperId,
                workoutId: value.workoutId,
                exerciseId: value.exerciseId,
            }));

            const payload = {
                planificationId,
                routineId,
                name: updates.name,
                newGrouperNames: namesPayload,
                exercisesToAdd: exercisesToAddPayload,
                workoutsToDelete: workoutsToDeletePayload,
                exercisesToDelete: exercisesToDeletePayload,
                grouperIdsToDelete: grouperIdsToDelete
            }
            await saveRoutineEditions(payload)
            await this.refresh()
            this.setState({
                editionMode: false,
                addExerciseInputIndex: null,
                activeDraftExercise: {
                    type: 'reps',
                    ex: []
                }
            })
            showSuccess(this.context, '', 'Cambios en la rutina guardados!')
        } catch (e) {
            console.error(e)
        } finally {
            this.setState({savingEditions: false})
        }
    }

    async saveSharedRoutine() {
        try {
            this.setState({savingSharedRoutine: true})
            const {routineId} = this.state;
            await saveSharedRoutine({routineId})
            this.setState({savingSharedRoutine: false, alreadyCopied: true})
            showSuccess(this.context, '', 'Rutina guardada en la planificacion "Rutinas Compartidas"!')
        } catch (e) {
            console.error(e)
        }
    }

    enableEditionRoutine() {
        const {blockGroupers} = this.state
        const indexes = []
        blockGroupers.map((bg,j) => bg.blocks.map((b,i) => indexes.push(j+'-'+i)))
        this.setState({editionMode: true, activeIndexes: indexes})
        this.context.dispatch(setData({secondaryActions: []}))
    }

    discardRoutineChanges() {
        const {backup} = this.state
        this.setState({
            editionMode: false,
            updates: {},
            name: backup.name,
            blockGroupers: backup.blockGroupers.map(b => (
            {
                ...b,
                blocks: b.blocks.map(bb => (
                    {
                        ...bb,
                        exercises: bb.exercises.map(e => ({...e}))
                    }
                ))
            })),
            addExerciseInputIndex: null,
            activeDraftExercise: {
                type: 'reps',
                ex: []
            }
        })
        this.setSecondaryActions()
    }

    setSecondaryActions(){
        const {actionable, canEdit} = this.state
        const {state: {permissions: {createManyExerciseBlocks, editRoutine}}} = this.context
        const secondaryActions = []
        if (actionable) {
            const action = {
                // func: () => this.addBlockInMemory(),
                func: () => this.addBlock(),
                description: <span><Icon name={'plus'}/> Nuevo Bloque</span>
            }
            if (!canEdit && editRoutine) {
                action.func = null
                action.disabled=true
                action.disableHeader='No es posible editar'
                action.disableDescription='Tu o un atleta ya marcaron esta rutina como completada u omitida'
            } else if (!createManyExerciseBlocks) {
                action.func = null
                action.disabled=true
            }
            secondaryActions.push(action)
            this.context.dispatch(setData({secondaryActions: secondaryActions, noBottomBar: false}))
        }
    }

    onRoutineNameChange(newName) {
        const {updates} = this.state
        this.setState({name: newName, updates: {...updates, name:newName}})
    }

    onGrouperNameChange(id, index, newName) {
        const {updates, blockGroupers} = this.state

        let buff = {...updates}
        if(buff.newGrouperNames) {
            buff.newGrouperNames[index] = {id, newName}
        } else {
            buff.newGrouperNames = {[index]: {id, newName}}
        }

        blockGroupers[index].name = newName
        this.setState({updates: {...buff}, blockGroupers})
    }

    deleteBlockGroup(id, i) {
        const {updates, blockGroupers} = this.state

        let buff = {...updates}
        if(buff.grouperIdsToDelete) {
            buff.grouperIdsToDelete.push(id)
        } else {
            buff.grouperIdsToDelete = [id]
        }

        const rBuff = [...blockGroupers]
        rBuff.splice(i, 1)
        this.setState({updates: {...buff}, blockGroupers: [...rBuff],confirmBlockGroupDeletionIndex: null})
    }

    deleteWorkFromBlockGroup(bgId, workId, j,i) {
        const {updates, blockGroupers} = this.state

        let buff = {...updates}
        if(buff.workoutsToDelete) {
            buff.workoutsToDelete[bgId+'-'+workId] = {grouperId: bgId, workoutId: workId}
        } else {
            buff.workoutsToDelete = {[bgId+'-'+workId]: {grouperId: bgId, workoutId: workId}}
        }

        blockGroupers[j].blocks.splice(i, 1)
        for (let k = i; k < blockGroupers[j].blocks.length; k++) {
            const nameType = blockGroupers[j].blocks[k].name.split(' - ')
            const name = nameType[0].split(' ')
            blockGroupers[j].blocks[k].name = name[0] + ' ' + (parseInt(name[1],10)-1) + ' - ' + nameType[1]
        }

        this.setState({updates: {...buff}, blockGroupers: [...blockGroupers],confirmWorkDeletionIndex: null})
    }

    deleteExerciseFromWork(bgId, workId, exId, j,i,k, isDraft) {
        const {updates, blockGroupers} = this.state

        if (!isDraft) {
            let buff = {...updates}
            if(buff.workOutExercisesToDelete) {
                buff.workOutExercisesToDelete[bgId+'-'+workId+'-'+exId] = {grouperId: bgId, workoutId: workId, exerciseId: exId}
            } else {
                buff.workOutExercisesToDelete = {[bgId+'-'+workId+'-'+exId]: {grouperId: bgId, workoutId: workId, exerciseId: exId}}
            }

            blockGroupers[j].blocks[i].exercises[k].toDelete = true
            this.setState({updates: {...buff}, blockGroupers: [...blockGroupers],confirmWorkExerciseDeletionIndex: null})
        } else {
            blockGroupers[j].blocks[i].exercises.splice(k,1)
            this.setState({blockGroupers: [...blockGroupers],confirmWorkExerciseDeletionIndex: null})
        }
    }

    canRoutineBeSavedByThirdPeople = (e, { name, value }) => this.setState({ canBeSaved: name === 'yes' && value })

    cancelAddNewExercise() {
        this.setState({
            addExerciseInputIndex: null,
            activeDraftExercise: {
                type: 'reps',
                ex: []
            }})
    }

    addNewExercise(bgId, workId, j,i,k, isSequential) {
        const {activeDraftExercise, addExerciseInputIndex, updates, blockGroupers} = this.state

        if (activeDraftExercise.ex.length===0) {
            //starting
            this.setState({
                addExerciseInputIndex: j + '-' + i + '-' + k,
                activeDraftExercise: {
                    bgId,
                    workId,
                    type: 'reps',
                    ex: []
                }
            })
        } else {
            //means it was set before
            const indexes = addExerciseInputIndex.split('-')
            const jp = indexes[0]
            const ip = indexes[1]
            const kp = indexes[2]

            //plus one because I will be inserted one after where I was rendered.
            const kpInt = parseInt(kp,10)
            const orderIndex = kpInt+1

            blockGroupers[jp].blocks[ip].exercises.splice(orderIndex,null, {
                id: null,
                isDraft: true,
                name: activeDraftExercise.ex[0].text,
                grouperId: activeDraftExercise.bgId,
                workoutId: activeDraftExercise.workId,
                exerciseId: activeDraftExercise.ex[0].value,
                type: activeDraftExercise.type,
                amount: activeDraftExercise.reps,
                [activeDraftExercise.type]: activeDraftExercise.reps,
            })

            //recalc K if we're adding a new exercise to the same work we want to continue editing.
            const currentKIndex = !isSequential && k > kpInt && workId === activeDraftExercise.workId ? (k+1) : k
            this.setState({
                blockGroupers: [...blockGroupers],
                addExerciseInputIndex: j + '-' + i + '-' + currentKIndex,
                activeDraftExercise: {
                    bgId,
                    workId,
                    type: 'reps',
                    ex: []
                }
            })
        }
    }

    renderAddExercise(bg, b, addExerciseInputIndex, j,i,k, isSequential) {
        let classes = 'table-plus-item'
        if (isSequential) {
            k++
            classes += ' table-plus-item-sequential'
        }
        const openKey = j + '-' + i + '-' + k
        return (
            <div className={classes}>
                {addExerciseInputIndex === openKey ?
                    <>
                        <Icon
                            name={'minus circle'}
                            color={'red'}
                            onClick={() => this.cancelAddNewExercise()}/>
                    </> :
                    <Icon
                        name={'plus circle'}
                        onClick={() => this.addNewExercise(bg.id, b.id, j,i,k, isSequential)}/>}
            </div>
        )
    }

    renderAddExerciseInputs(bg, b, addExerciseInputIndex, j,i,k, activeDraftExercise) {
        return (
            <>
                {
                    addExerciseInputIndex === j+'-'+i+'-'+k &&
                    <Table.Row style={{position: 'relative'}}>
                        <Table.Cell colSpan={'3'} style={{position: 'relative'}}>
                            <Grid>
                                <Grid.Row className={'padding-1'}>
                                    <Grid.Column width={10} className={'no-padding'}>
                                        <ExerciseSearch
                                            basic
                                            // allowAdditions
                                            defaultSelected={activeDraftExercise.ex}
                                            onSelected={(selected)=> this.setState({activeDraftExercise: {...activeDraftExercise, grouperId: bg.id, workoutId: b.id, order: k, ex: selected}})}/>
                                    </Grid.Column>
                                    <Grid.Column width={3} className={'no-padding'}>
                                        <Input
                                            className={'line-height-dropdown'}
                                            fluid
                                            placeholder='10' type={'number'}
                                            min={1}
                                            max={99}
                                            value={activeDraftExercise.reps}
                                            onKeyDown={(event) => {}}
                                            onChange={(e, {value}) => this.setState({activeDraftExercise: {...activeDraftExercise, reps:value}})}/>
                                    </Grid.Column>
                                    <Grid.Column width={3} className={'no-padding'}>
                                        <SegRepsButtonGroup default={activeDraftExercise.type} onIntervalSelected={(val) => this.setState({activeDraftExercise: {...activeDraftExercise, type:val}})}/>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            {this.renderAddExercise(bg, b, addExerciseInputIndex, j,i,k, true)}
                        </Table.Cell>
                    </Table.Row>
                }
            </>
        )
    }

    renderWorkoutGroup(bg, b, j, i, editionMode, activeIndexes, confirmWorkDeletionIndex, addExerciseInputIndex, activeDraftExercise, confirmWorkExerciseDeletionIndex) {
        //todo: fix separate type from workout name.
        const name = b.name.split(' - ')
        return (
            <Segment style={{width: '100%'}} className={'no-left-padding no-right-padding'} key={b.id}>
                <Accordion.Title
                    className={'no-top-padding no-bottom-padding padding-left-1 padding-right-1'}
                    active={activeIndexes.indexOf(j+'-'+i) !== -1}
                    index={j+'-'+i}
                    onClick={!editionMode? this.handleActiveBlocks : () => {}}>
                    Trabajo {i+1} {name[1] ? <Chip feel content={capitalize(name[1])}/> : null}
                    {
                        editionMode &&
                        <PopUpConfirmation
                            title={'Borrar '+name[0]+'?'}
                            primary={'Borrar'}
                            secondary={'Cancelar'}
                            isManaged
                            open={(j+'-'+i)===confirmWorkDeletionIndex}
                            trigger={<Button
                                onClick={() => this.setState({confirmWorkDeletionIndex: j+'-'+i})}
                                basic secondary icon='close' style={
                                {position: 'relative', float: 'right', padding: 0, fontSize: 13}
                            }/>}
                            onPrimaryAction={() => this.deleteWorkFromBlockGroup(bg.id, b.id, j, i)}
                            onSecondaryAction={() => this.setState({confirmWorkDeletionIndex: null})}
                        />
                    }
                </Accordion.Title>
                <Accordion.Content active={activeIndexes.indexOf(j+'-'+i) !== -1}>
                    <Segment basic className={'no-top-padding no-bottom-padding no-margin'}>
                        {b.duration && <div><b>{b.duration} minutos</b> de duracion</div>}
                        {b.laps && <div className={'margin-bottom-1'}><b>{b.laps}</b> rondas</div>}
                        {
                            (b.laprestinterval || b.exerestinterval) &&
                            <>
                                Descanso
                                {b.exerestinterval &&
                                    <div>
                                        <b>{b.exerestinterval} segs</b> por ejercicio
                                    </div>}
                                {b.laprestinterval &&
                                    <div>
                                        <b>{b.laprestinterval} segs</b> por ronda
                                    </div>}
                            </>
                        }
                    </Segment>
                    <Table basic unstackable style={{border: 'unset'}}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Ejercicio</Table.HeaderCell>
                                {b.exercises.find(e => e.reps || e.secs) && <Table.HeaderCell>Trabajo</Table.HeaderCell>}
                                {editionMode && <Table.HeaderCell/>}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                b.exercises.length === 0 &&
                                <>
                                    <Table.Row style={{position: 'relative'}}>
                                        <Table.Cell>
                                            Sin Ejercicios
                                            {editionMode && this.renderAddExercise(bg, b, addExerciseInputIndex, j,i,0)}
                                        </Table.Cell>
                                    </Table.Row>
                                    {this.renderAddExerciseInputs(bg, b, addExerciseInputIndex, j,i,0, activeDraftExercise)}
                                </>
                            }
                            {b.exercises.map((e, k) => (this.renderExercise(
                                bg, b, e, j, i, k, editionMode, addExerciseInputIndex, activeDraftExercise, confirmWorkExerciseDeletionIndex
                            )))}
                        </Table.Body>
                    </Table>
                </Accordion.Content>
            </Segment>
        )
    }

    renderExercise(bg, b, e, j, i, k, editionMode, addExerciseInputIndex, activeDraftExercise, confirmWorkExerciseDeletionIndex) {
        const hasValue = e.reps || e.secs
        return (
            <>
                <Table.Row key={k} className={'table-row-item'}>
                    <Table.Cell style={{position: 'relative'}} colSpan={editionMode ? '3' : null}>
                        <Grid>
                            <Grid.Column width={editionMode ? !hasValue ? 13 : 8 : 16}>
                                {e.isDraft && <div className={'label-new-item'}/>}
                                {e.videoCode ? <Link to={'#'} onClick={() => this.openExerciseVideo(e.videoCode)}>{e.name}</Link> : e.name}
                            </Grid.Column>
                            {
                                editionMode &&
                                <Grid.Column width={!hasValue ? 3 : 8}>
                                    {
                                        e.toDelete &&
                                        <>
                                            <Label color='red' style={{float: 'right'}}>
                                                A borrar
                                            </Label>
                                        </>
                                    }
                                    {
                                        !e.toDelete &&
                                        <>
                                            {hasValue && (e.reps ? e.reps+' Reps' : e.secs+' Segs')}
                                            <PopUpConfirmation
                                                title={'Borrar '+e.name+'?'}
                                                primary={'Borrar'}
                                                secondary={'Cancelar'}
                                                isManaged
                                                open={(j+'-'+i+'-'+k)===confirmWorkExerciseDeletionIndex}
                                                trigger={<Button
                                                    onClick={() => this.setState({confirmWorkExerciseDeletionIndex: j+'-'+i+'-'+k})}
                                                    className={'table-remove-item'} icon='close'/>}
                                                onPrimaryAction={() => this.deleteExerciseFromWork(bg.id, b.id, e.id, j, i, k, e.isDraft)}
                                                onSecondaryAction={() => this.setState({confirmWorkExerciseDeletionIndex: null})}
                                            />
                                        </>
                                    }
                                </Grid.Column>
                            }
                        </Grid>
                        {this.renderAddExercise(bg, b, addExerciseInputIndex, j,i,k)}
                    </Table.Cell>
                    {
                        (e.reps || e.secs) && !editionMode &&
                        <Table.Cell>
                            {e.reps ? e.reps+' Reps' : e.secs+' Segs'}
                        </Table.Cell>
                    }
                </Table.Row>
                {this.renderAddExerciseInputs(bg, b, addExerciseInputIndex, j,i,k, activeDraftExercise)}
            </>
        )
    }

    renderRoutineDetails() {
        const {state: {permissions: {executeRoutine, editRoutine, canSaveSharedRoutines}}} = this.context
        const {
            name,
            confirmBlockGroupDeletionIndex,
            confirmWorkDeletionIndex,
            confirmWorkExerciseDeletionIndex,
            addExerciseInputIndex,
            activeDraftExercise,
            difficulty,
            duration,
            editionMode,
            actionable,
            canEdit,
            savingEditions,
            blockGroupers,
            activeIndexes,
            isShared,
            isCopy,
            canBeSaved,
            savingSharedRoutine,
            showPopUp,
            showLinkGenerated,
            isOwner,
            alreadyCopied,
            showCreateBlockModal,
            nextBlockNumber,
            showModalCopyLink,
            routineLink
        } = this.state;
        const savingMode = editionMode && canEdit && editRoutine

        return (
            <>
                <Header as={'h3'}>
                    {
                        !editionMode &&
                        <Button className={'header-back-arrow'} icon onClick={() => isShared? this.redirectToPlanifications() : this.redirectToPlanification()}>
                            <Icon name={'arrow left'}/>
                        </Button>
                    }
                    {
                        editionMode &&
                        <PopUpContinueEditing onDiscardChanges={() => this.discardRoutineChanges()}/>
                    }
                    {
                        !editionMode ? name :
                        <Input
                            className={'input-header'}
                            placeholder={name}
                            value={name}
                            onChange={(e, {value}) => this.onRoutineNameChange(value)}/>
                    }
                    {
                        (!editionMode && actionable && !isCopy) &&
                        <PopUpConfirmation
                            title={'Compartir Rutina'}
                            primary={'Compartir'}
                            secondary={'Cancelar'}
                            isManaged
                            open={showPopUp}
                            trigger={<Icon name={'share square outline'} className={'header-icon'} onClick={() => this.setState({showPopUp: true})}/>}
                            onPrimaryAction={() => this.shareRoutine()}
                            onSecondaryAction={() => this.setState({showPopUp: false})}
                        >
                            <div className={'margin-bottom-1'}>
                                Pueden los invitados guardar la rutina? Permite crear una copia de la rutina en la cuenta de los invitados, con acceso a tus videos. Sino, por defecto el link expira en 14 dias. Si creas un nuevo link, reemplazara al existente pero los invitados que hayan guardado la rutina podran seguir accediendola.
                            </div>
                            <div className={'margin-bottom-half'}>
                                <Radio
                                    label='Permitir Guardar'
                                    name='yes'
                                    value={true}
                                    checked={this.state.canBeSaved}
                                    onChange={this.canRoutineBeSavedByThirdPeople}
                                />
                            </div>
                            <div>
                                <Radio
                                    label='No Permitir'
                                    name='no'
                                    value={false}
                                    checked={!this.state.canBeSaved}
                                    onChange={this.canRoutineBeSavedByThirdPeople}
                                />
                            </div>
                        </PopUpConfirmation>
                    }
                    {
                        (!editionMode && actionable) ?
                            editRoutine ?
                                (canEdit ?
                                    <Icon name={'edit outline'} className={'header-icon'} onClick={() => this.enableEditionRoutine()}/>
                                    :
                                    <PopUpDisabledAction
                                        disableHeader={'No es posible editar'}
                                        disableDescription={'Tu o un atleta ya marcaron esta rutina como completada u omitida'}
                                        trigger={<Icon name={'edit outline'} className={'header-icon disabled-btn'}/>}/>)
                                :
                                <PopUpDisabledAction trigger={<Icon name={'edit outline'} className={'header-icon disabled-btn'}/>}/>
                            : null
                    }
                    {
                        savingMode &&
                        <Icon disabled={savingEditions} name={'save outline'} className={'header-icon'} onClick={() => this.saveRoutineEditions()}/>
                    }
                    {
                        !canSaveSharedRoutines ?
                            <PopUpDisabledAction trigger={<Icon name={'save outline'} className={'header-icon disabled-btn'}/>}/> :
                            (isShared && canBeSaved && canSaveSharedRoutines && !alreadyCopied) &&
                            <Icon disabled={savingSharedRoutine} name={'save outline'} className={'header-icon'} onClick={() => this.saveSharedRoutine()}/>
                    }
                    <div>
                        <Chip style={{fontSize: 14}} success={difficulty===1} progress={difficulty===2} content={difficulty===1? 'Facil' : 'Intermedia'}/>
                        <Chip style={{fontSize: 14}}  omit content={duration}/>
                    </div>
                </Header>
                {/*{*/}
                {/*    (isOwner || executeRoutine || isShared) &&*/}
                {/*    <Button*/}
                {/*        style={{marginBottom: '1em'}}*/}
                {/*        primary fluid*/}
                {/*        onClick={() => this.redirectToRoutineExecution()}>*/}
                {/*        Ejecutar Rutina*/}
                {/*    </Button>*/}
                {/*}*/}
                {/*{*/}
                {/*    (!isOwner && !executeRoutine && !isShared) &&*/}
                {/*    <PopUpDisabledAction trigger={<Button className={'disabled-btn'} style={{marginBottom: '1em'}} primary fluid>*/}
                {/*        Ejecutar Rutina*/}
                {/*    </Button>}/>*/}
                {/*}*/}
                {
                    blockGroupers.length === 0 &&
                    <Message>
                        <Message.Header>Rutina Vacia</Message.Header>
                        <p>Comienza agregando algunos bloques de trabajo</p>
                    </Message>
                }
                <Accordion
                    style={{marginBottom: '1em'}}
                    exclusive={false}
                    fluid>
                    {blockGroupers.map((bg,j) => (
                        <Segment key={j} className={'padding-left-half padding-right-half'}>
                            <Header className={'align-center'} as={'h5'}>
                                {!editionMode && <span>{bg.name}</span>}
                                {
                                    editionMode &&
                                    <>
                                        <Input
                                            className={'input-header input-centered'}
                                            placeholder={bg.name}
                                            value={bg.name}
                                            onChange={(e, {value}) => this.onGrouperNameChange(bg.id, j, value)}/>
                                        <PopUpConfirmation
                                            title={'Borrar '+bg.name+'?'}
                                            primary={'Borrar'}
                                            secondary={'Cancelar'}
                                            isManaged
                                            open={j===confirmBlockGroupDeletionIndex}
                                            trigger={<Button
                                                             onClick={() => this.setState({confirmBlockGroupDeletionIndex: j})}
                                                             basic secondary icon='close' style={
                                                {position: 'relative', float: 'right', padding: 0, fontSize: 13}
                                            }/>}
                                            onPrimaryAction={() => this.deleteBlockGroup(bg.id, j)}
                                            onSecondaryAction={() => this.setState({confirmBlockGroupDeletionIndex: null})}
                                        />
                                    </>
                                }
                            </Header>
                            <div>
                                {
                                    bg.blocks.length === 0 &&
                                    <Message><Message.Content>Comienza agregando algunos trabajos al bloque</Message.Content></Message>
                                }
                                {bg.blocks.map((b,i) => (this.renderWorkoutGroup(
                                    bg, b, j, i, editionMode, activeIndexes, confirmWorkDeletionIndex, addExerciseInputIndex, activeDraftExercise, confirmWorkExerciseDeletionIndex
                                )))}
                            </div>
                            <Divider horizontal>
                                {
                                    (!editionMode && actionable) ?
                                        !editRoutine ?
                                            <PopUpDisabledAction
                                                trigger={<Icon name={'plus'} className={'disabled-btn'}/>}/>
                                            :
                                            canEdit ?
                                            <Icon name={'plus'} onClick={() => this.addWorkToGrouper(bg, j)}/> :
                                            <PopUpDisabledAction
                                                disableHeader={'No es posible agregar'}
                                                disableDescription={'Tu o un atleta ya marcaron esta rutina como completada u omitida'}
                                                trigger={<Icon name={'plus'} className={'disabled-btn'}/>}/> : null
                                }
                            </Divider>
                        </Segment>
                    ))}
                </Accordion>
                <ModalBlockCreate
                    open={showCreateBlockModal}
                    next={nextBlockNumber}
                    onChange={(name)=> this.setState({newBlockName: name})}
                    onClose={() => this.addNewBlockGroupClose()}
                    onConfirm={() => this.addNewBlockGroupConfirm()}/>
                {
                    showModalCopyLink &&
                    <Modal dimmer={'blurring'} size="mini" open={showModalCopyLink} onClose={() => this.setState({showModalCopyLink: false, routineLink:null})}>
                        <Modal.Header>Link Generado!</Modal.Header>
                        <Modal.Content style={{lineBreak: 'anywhere'}}>
                            <p>{routineLink}</p>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button secondary onClick={() => this.setState({showModalCopyLink: false, routineLink:null})}>Cerrar</Button>
                        </Modal.Actions>
                    </Modal>
                }
            </>
        )
    }

    render() {
        const {loading} = this.state;

        if (loading) {
            return <Loader active/>
        }

        return this.renderRoutineDetails()
    }
}

export default withRouter(PageRoutineDetail);