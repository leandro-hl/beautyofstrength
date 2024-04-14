import React, {Component, useContext, useState} from "react";
import {
    Accordion,
    Button,
    Divider, Grid,
    Header,
    Icon, Image,
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
    copyTemplateRoutineToPlanification,
    getRoutineDetails,
    getSharedRoutineDetails,
    saveRoutineEditions, saveRoutineExecution,
    saveSharedRoutine,
    shareRoutine, uploadRoutineImage
} from "../service";
import {AppContext, setData, showError, showSuccess, showWarning} from "../context";
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
import {ModalRoutineToPlanificationCopy} from "./ModalRoutineToPlanificationCopy";
import {ModalExerciseExecuteTimer} from "./ModalExerciseExecuteTimer";
import {ModalBorgScale} from "./ModalBorgScale";
import {ImageUpload} from "./ImageUpload";
import {ImageCropper} from "./ImageCropper";
import {ReactComponent as ExerciseIcon} from '../icons/exercise.svg'
import {ReactComponent as RefreshIcon} from '../icons/refresh.svg'
import {ReactComponent as BlockTypeIcon} from '../icons/manufacturing.svg'
import {TooltipInfoButton} from "./mui/TooltipInfoButton";

const MenuHeaderRender = ({
                              alreadyMarkedByMe,
                              name,
                              difficulty,
                              duration,
                              canEdit,
                              actionable,
                              isShared,
                              isCopy,
                              canBeSaved,
                              savingSharedRoutine,
                              alreadyCopied,
                              redirectToPlanifications,
                              redirectToPlanification,
                              redirectToSuite,
                              discardRoutineChanges,
                              onRoutineNameChange,
                              shareRoutine,
                              enableEditionRoutine,
                              saveRoutineEditions,
                              saveSharedRoutine,
                              openCopyToPlanificationModal,
                              startRoutine,
                                finishRoutine,
                              cancelRoutineExecution
                          }) => {
    const {state: {permissions: {editRoutine, canSaveSharedRoutines, canExecuteRoutine}, isTemplate}} = useContext(AppContext)

    const [canBeSavedConf, setCanBeSavedConf] = useState(false)
    const [routineName, setRoutineName] = useState(name)
    const [showPopUp, setShowPopUp] = useState(false)
    const [editionMode, setEditionMode] = useState(false)
    const [savingEditions, setSavingEditions] = useState(false)
    const [routineStarted, setRoutineStarted] = useState(false)

    const savingMode = editionMode && canEdit && editRoutine
    const canRoutineBeSavedByThirdPeople = (e, { name, value }) => setCanBeSavedConf(name === 'yes' && value)

    return (
        <>
            {
                !editionMode && !routineStarted &&
                <Button className={'header-back-arrow'} icon onClick={() => isTemplate ? redirectToSuite() : isShared? redirectToPlanifications() : redirectToPlanification()}>
                    <Icon name={'arrow left'}/>
                </Button>
            }
            {
                editionMode &&
                <PopUpContinueEditing onDiscardChanges={() => {
                    discardRoutineChanges()
                    setEditionMode(false)
                }}/>
            }
            {
                routineStarted &&
                <PopUpContinueEditing onDiscardChanges={() => {
                    cancelRoutineExecution()
                    setRoutineStarted(false)
                }}/>
            }
            {
                !editionMode ? routineName :
                    <Input
                        className={'input-header'}
                        placeholder={routineName}
                        value={routineName}
                        onChange={(e, {value}) => {
                            setRoutineName(value)
                            onRoutineNameChange(value)
                        }}/>
            }
            {
                isTemplate && !editionMode &&
                <Icon name={'copy outline'} className={'header-icon'}  onClick={() => openCopyToPlanificationModal()}/>
            }
            {
                canExecuteRoutine && !alreadyMarkedByMe && !isTemplate && !editionMode && !routineStarted &&
                <Icon className={'header-icon'} name={'play circle outline'} onClick={() => {
                    setRoutineStarted(true)
                    startRoutine()
                }}/>
            }
            {
                !canExecuteRoutine &&
                <PopUpDisabledAction trigger={<Icon name={'play circle outline'} className={'header-icon disabled-btn'}/>}/>
            }
            {
                !isTemplate && !editionMode && routineStarted &&
                <Icon className={'header-icon'} name={'flag checkered'} onClick={() => {
                    setRoutineStarted(false)
                    finishRoutine()
                }}/>
            }
            {
                (!isTemplate && !editionMode && !routineStarted && actionable && !isCopy) &&
                <PopUpConfirmation
                    title={'Compartir Rutina'}
                    primary={'Compartir'}
                    secondary={'Cancelar'}
                    isManaged
                    open={showPopUp}
                    trigger={<Icon name={'share square outline'} className={'header-icon'} onClick={() => setShowPopUp(true)}/>}
                    onPrimaryAction={() => {
                        shareRoutine(canBeSavedConf)
                        setShowPopUp(false)
                    }}
                    onSecondaryAction={() => setShowPopUp(false)}
                >
                    <div className={'margin-bottom-1'}>
                        Pueden los invitados guardar la rutina? Permite crear una copia de la rutina en la cuenta de los invitados, con acceso a tus videos (Cuenta instructor). El link expira en 14 dias. Si creas un nuevo link, reemplazara al existente pero los invitados que hayan guardado la rutina podran seguir accediendola.
                    </div>
                    <div className={'margin-bottom-half'}>
                        <Radio
                            label='Permitir Guardar'
                            name='yes'
                            value={true}
                            checked={canBeSavedConf}
                            onChange={canRoutineBeSavedByThirdPeople}
                        />
                    </div>
                    <div>
                        <Radio
                            label='No Permitir'
                            name='no'
                            value={false}
                            checked={!canBeSavedConf}
                            onChange={canRoutineBeSavedByThirdPeople}
                        />
                    </div>
                </PopUpConfirmation>
            }
            {
                (!editionMode && !routineStarted && actionable) ?
                    editRoutine ?
                        (canEdit ?
                            <Icon name={'edit outline'} className={'header-icon'} onClick={() => {
                                setEditionMode(true)
                                enableEditionRoutine()
                            }}/>
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
                <Icon disabled={savingEditions} name={'save outline'} className={'header-icon'} onClick={async () => {
                    setSavingEditions(true)
                    await saveRoutineEditions()
                    setSavingEditions(false)
                    setEditionMode(false)
                }}/>
            }
            {
                !canSaveSharedRoutines ?
                    <PopUpDisabledAction trigger={<Icon name={'save outline'} className={'header-icon disabled-btn'}/>}/> :
                    (isShared && canBeSaved && canSaveSharedRoutines && !alreadyCopied) &&
                    <Icon disabled={savingSharedRoutine} name={'save outline'} className={'header-icon'} onClick={() => saveSharedRoutine()}/>
            }
            <div>
                <Chip style={{fontSize: 14, color: "#252525"}} success={difficulty===1} progress={difficulty===2} content={difficulty===1? 'Facil' : 'Intermedia'}/>
                <Chip style={{fontSize: 14, color: "#252525"}}  omit content={duration}/>
            </div>
        </>
    )
}

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

    componentWillUnmount() {
        this.context.dispatch(setData({coverImageUrl: null, loadCoverImage:null}, true))
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
                this.context.dispatch(setData({routineId: res.data.id, isTemplate: false, shared: true, coverImageUrl:  res.data.coverImageUrl, loadCoverImage: !!res.data.coverImageUrl}, true))
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
            this.setTopBar()
        } catch (e) {
            console.error(e)
        }
    }

    async refresh() {
        const {state: {routineId, planificationId, isOwner, draftBlockGroupers, isTemplate, coverImageUrl}} = this.context
        const {state: {permissions: {canUploadRoutineCover}}} = this.context
        const res = await getRoutineDetails(routineId, isTemplate);
        let cover = coverImageUrl
        let loadCoverImage = false
        if (!cover) {
            cover = res.data.coverImageUrl
        }
        if(cover) {
            loadCoverImage=true
        }
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
            menuButtonSelected: isTemplate? MENU.INSTRUCTOR_SUITE : MENU.PLANIFICATIONS,
        }))
        this.context.dispatch(setData({
            nextBlockNumber: res.data.blockGroupers.length+draftBlockGroupers.length+1,
            coverImageUrl: cover
        }, true))
        this.context.dispatch(setData({
            loadCoverImage
        }), true)

        this.setState({
            loading: false,
            backup,
            updates: {},
            planificationId,
            isOwner,
            showUploadRoutineImage: canUploadRoutineCover && isOwner && !cover,
            routineId,
            canEdit,
            isCopy: res.data.isCopy,
            alreadyCopied: res.data.alreadyCopied,
            actionable,
            shared: false,
            alreadyMarkedByAthetles: res.data.alreadyMarkedByAthetles,
            blockGroupers: [...res.data.blockGroupers, ...draftBlockGroupers],
            name: res.data.name,
            alreadyMarkedByMe: res.data.alreadyMarkedByMe,
            difficulty: res.data.difficulty,
            duration: res.data.duration,
            nextBlockNumber: res.data.blockGroupers.length+draftBlockGroupers.length+1})
        this.setSecondaryActions()
    }

    openCopyToPlanificationModal() {
        this.setState({openCopyToPlanificationModal: true})
    }

    setTopBar() {
        this.context.dispatch(setData({
            MenuHeaderRender: <MenuHeaderRender
                alreadyMarkedByMe={this.state.alreadyMarkedByMe}
                name={this.state.name}
                difficulty={this.state.difficulty}
                duration={this.state.duration}
                isShared={this.state.isShared}
                isCopy={this.state.isCopy}
                canBeSaved={this.state.canBeSaved}
                savingSharedRoutine={this.state.savingSharedRoutine}
                actionable={this.state.actionable}
                alreadyCopied={this.state.alreadyCopied}
                canEdit={this.state.canEdit}
                redirectToPlanifications={() => this.redirectToPlanifications()}
                redirectToPlanification={() => this.redirectToPlanification()}
                redirectToSuite={() => this.redirectToSuite()}
                discardRoutineChanges={() => this.discardRoutineChanges()}
                onRoutineNameChange={(newName) => this.onRoutineNameChange(newName)}
                shareRoutine={(canBeSaved) => this.shareRoutine(canBeSaved)}
                enableEditionRoutine={() => this.enableEditionRoutine()}
                saveRoutineEditions={() => this.saveRoutineEditions()}
                saveSharedRoutine={() => this.saveSharedRoutine()}
                openCopyToPlanificationModal={() => this.openCopyToPlanificationModal()}
                startRoutine={() => this.startRoutine()}
                finishRoutine={() => this.finishRoutine()}
                cancelRoutineExecution={() => this.cancelRoutineExecution()}
            />
        }))
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

    redirectToSuite() {
        this.props.history.push('/suite')
    }

    redirectToRoutineExecution() {
        const {blockGroupers}=this.state
        this.context.dispatch(setData({routineToExecute: {blockGroupers}}))
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

    async shareRoutine(canBeSaved) {
        let res = {}
        try {
            const {planificationId, routineId} = this.state
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
            const {state: {isTemplate}} = this.context
            const {planificationId, routineId, activeDraftExercise, updates, blockGroupers, addExerciseInputK} = this.state
            this.setState({savingEditions: true})

            const namesPayload = Object.entries(updates.newGrouperNames ?? []).map(([key, value]) => ({
                id: parseInt(value.id, 10),
                name: value.newName
            }));

            const exercisesToAddPayload = []
            for (let i = 0; i < blockGroupers.length; i++) {
                for (let j = 0; j < blockGroupers[i].blocks.length; j++) {
                    const workout = blockGroupers[i].blocks[j]
                    exercisesToAddPayload.push({grouperId: blockGroupers[i].id,workoutId: workout.id, exercises: []})
                    let toDeleteAccumulator = 0
                    const additionIndex = exercisesToAddPayload.length-1
                    if (workout.exercises.length === 0) {
                        //add activeDraftExercise
                        if (activeDraftExercise.ex.length>0 && activeDraftExercise.workoutId === workout.id) {
                            const item = {
                                order: 0,
                                grouperId: activeDraftExercise.grouperId,
                                workoutId: activeDraftExercise.workoutId,
                                exerciseId:activeDraftExercise.ex[0].value,
                                [activeDraftExercise.type]: parseInt(activeDraftExercise.reps,10)
                            }
                            exercisesToAddPayload[additionIndex].exercises.push(item)
                        }
                    } else  {
                        for (let k = 0; k < workout.exercises.length; k++) {
                            const ex = workout.exercises[k]
                            if (ex.toDelete) {
                                toDeleteAccumulator++
                            } else if (ex.isDraft) {
                                const order = activeDraftExercise.order < k && activeDraftExercise.workoutId === ex.workoutId ? k+1 : k
                                exercisesToAddPayload[additionIndex].exercises.push({
                                    order: order - toDeleteAccumulator,
                                    grouperId: ex.grouperId,
                                    workoutId: ex.workoutId,
                                    exerciseId: ex.exerciseId,
                                    [ex.type]: parseInt(ex.amount,10),
                                })
                            }
                            if (addExerciseInputK === k) {
                                //add activeDraftExercise
                                if (activeDraftExercise.ex.length>0 && activeDraftExercise.workoutId === workout.id) {
                                    const item = {
                                        order: (k+1) - toDeleteAccumulator,
                                        grouperId: activeDraftExercise.grouperId,
                                        workoutId: activeDraftExercise.workoutId,
                                        exerciseId:activeDraftExercise.ex[0].value,
                                        [activeDraftExercise.type]: parseInt(activeDraftExercise.reps,10)
                                    }
                                    exercisesToAddPayload[additionIndex].exercises.push(item)
                                }
                            }
                        }
                    }
                }
            }

            const grouperIdsToDelete = (updates.grouperIdsToDelete ?? []).map(id => id);

            const workoutsToDeletePayload = Object.entries(updates.workoutsToDelete ?? []).map(([key, value]) => ({
                grouperId: value.grouperId,
                workoutId: value.workoutId
            }));

            const workoutsToUpdatePayload = Object.entries(updates.workoutsToUpdate ?? []).map(([key, value]) => ({
                grouperId: value.grouperId,
                workoutId: value.workoutId,
                laps: value.laps ? parseInt(value.laps, 10) : value.deflaps,
                exerestinterval: value.exerestinterval ? parseInt(value.exerestinterval, 10) : value.defexerestinterval,
                laprestinterval: value.laprestinterval ? parseInt(value.laprestinterval, 10) : value.deflaprestinterval,
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
                grouperIdsToDelete: grouperIdsToDelete,
                workoutsToUpdate: workoutsToUpdatePayload,
                isTemplate
            }

            await saveRoutineEditions(payload)
            await this.refresh()
            this.setState({
                editionMode: false,
                addExerciseInputIndex: null,
                addExerciseInputK: null,
                activeDraftExercise: {
                    type: 'reps',
                    ex: []
                }
            })
            showSuccess(this.context, '', 'Cambios en la rutina guardados!')
        } catch (e) {
            console.error(e)
        } finally {
            this.setState({
                savingEditions: false
            })
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

    activateAllIndexes() {
        const {blockGroupers} = this.state
        const indexes = []
        blockGroupers.map((bg,j) => bg.blocks.map((b,i) => indexes.push(j+'-'+i)))
        this.setState({activeIndexes: indexes})
    }

    generateAllExerciseGrids() {

    }

    enableEditionRoutine() {
        this.activateAllIndexes()
        this.setState({editionMode: true})
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
            addExerciseInputK: null,
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
        this.setState({updates: {...updates, name:newName}})
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

    startExercise(e,j,i,k) {
        if (e.secs) {
            this.setState({executeWithTimer: {...e, j,i,k}})
        }
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
        showSuccess(this.context, '', 'Borrado!')
    }

    onWorkoutUpdate(bgId, workId, j, i, name, value) {
        const {updates, blockGroupers} = this.state

        let buff = {...updates}
        const defaults = {
            deflaps: blockGroupers[j].blocks[i].laps,
            defexerestinterval: blockGroupers[j].blocks[i].exerestinterval,
            deflaprestinterval: blockGroupers[j].blocks[i].laprestinterval
        }
        if(buff.workoutsToUpdate) {
            if (buff.workoutsToUpdate[bgId+'-'+workId]) {
                const newData = {...buff.workoutsToUpdate[bgId+'-'+workId], [name]: value}
                buff.workoutsToUpdate[bgId+'-'+workId] = newData
            } else {
                buff.workoutsToUpdate[bgId+'-'+workId] = {...defaults, grouperId: bgId, workoutId: workId, [name]: value}
            }
        } else {
            buff.workoutsToUpdate = {[bgId+'-'+workId]: {...defaults, grouperId: bgId, workoutId: workId, [name]: value}}
        }

        // laps
        // exerestinterval
        // laprestinterval
        blockGroupers[j].blocks[i][name]=value
        this.setState({updates: {...buff}, blockGroupers})
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

    cancelAddNewExercise() {
        this.setState({
            addExerciseInputIndex: null,
            addExerciseInputK: null,
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
                addExerciseInputK: k,
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
                addExerciseInputK: currentKIndex,
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
                                <Grid.Row className={'padding-1 add-exercise-row'}>
                                    <Grid.Column width={10} className={'no-padding'}>
                                        <ExerciseSearch
                                            basic
                                            allowAdditions
                                            defaultSelected={activeDraftExercise.ex}
                                            onSelected={(selected)=> {
                                                const newActiveDraftExercise = {...activeDraftExercise, grouperId: bg.id, workoutId: b.id, order: k, ex: selected}
                                                this.setState({activeDraftExercise: newActiveDraftExercise})
                                            }}/>
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

    renderWorkoutGroup(bg, b, j, i,
                       editionMode, activeIndexes, confirmWorkDeletionIndex,
                       addExerciseInputIndex, activeDraftExercise, confirmWorkExerciseDeletionIndex, routineStarted) {
        //todo: fix separate type from workout name.
        const name = b.name.split(' - ')
        const lastExerciseIndex=b.exercises.length-1
        return (
            <Segment style={{width: '100%'}} className={'no-left-padding no-right-padding'} key={b.id}>
                <Accordion.Title
                    className={'no-top-padding no-bottom-padding padding-left-1 padding-right-1'}
                    active={activeIndexes.indexOf(j+'-'+i) !== -1}
                    index={j+'-'+i}
                    onClick={(!editionMode && !routineStarted)? this.handleActiveBlocks : () => {}}>

                    <b className={'title'}>
                        {name[0]}
                    </b>
                    {name[1] && <Chip feel>
                        <BlockTypeIcon/> {capitalize(name[1])}
                    </Chip>}
                    {b.laps && <Chip feel>
                        {b.laps} Rondas
                        <TooltipInfoButton title={"Tambien llamadas Sets"}/>
                    </Chip>}

                    {routineStarted &&
                        <Icon className={'table-play'} name={'play'}
                              style={{position: 'relative', float: 'right', padding: 0, fontSize: 13}}
                              onClick={() => this.executeWorkGroup(b, j, i)}/>}

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
                    <Segment basic className={'no-bottom-padding no-margin'}>
                        {
                            editionMode &&
                            <Table basic={'very'} compact unstackable>
                                <Table.Row>
                                    <Table.Cell>
                                        Rondas<TooltipInfoButton title={"Tambien llamadas Sets"}/>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Input
                                            placeholder={b.laps}
                                            className={'input-centered size-two-digits'}
                                            type={'number'}
                                            value={b.laps}
                                            name={'laps'}
                                            onChange={(e, {value,name}) => this.onWorkoutUpdate(bg.id, b.id, j, i, name, value)}/>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        Descanso Por Ejercicio
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Input
                                            placeholder={b.exerestinterval}
                                            className={'input-centered size-two-digits'}
                                            type={'number'}
                                            value={b.exerestinterval}
                                            name={'exerestinterval'}
                                            onChange={(e, {value,name}) => this.onWorkoutUpdate(bg.id, b.id, j, i, name, value)}/>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        Descanso Por Ronda
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Input
                                            placeholder={b.laprestinterval}
                                            className={'input-centered size-two-digits'}
                                            type={'number'}
                                            value={b.laprestinterval}
                                            name={'laprestinterval'}
                                            onChange={(e, {value,name}) => this.onWorkoutUpdate(bg.id, b.id, j, i, name, value)}/>
                                    </Table.Cell>
                                </Table.Row>
                            </Table>
                        }
                        {
                            !editionMode &&
                            <>
                                {b.duration && <div><b>{b.duration} minutos</b> de duracion</div>}
                                {
                                    (b.laprestinterval || b.exerestinterval) &&
                                    <>
                                        Descanso
                                        {b.exerestinterval &&
                                            <Chip style={{fontSize: 14, color: "#252525"}} feel>{b.exerestinterval}s por <ExerciseIcon/></Chip>}
                                        {b.laprestinterval &&
                                            <Chip style={{fontSize: 14, color: "#252525"}} feel>{b.laprestinterval}s por <RefreshIcon/></Chip>}
                                    </>
                                }
                            </>
                        }
                    </Segment>
                    <Table basic unstackable style={{border: 'unset'}}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell colSpan={editionMode? null : 3}>Ejercicio</Table.HeaderCell>
                                {b.exercises.find(e => e.reps || e.secs) && <Table.HeaderCell>Trabajo</Table.HeaderCell>}
                                {(editionMode || routineStarted) && <Table.HeaderCell/>}
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
                                bg, b, e, j, i, k,
                                editionMode, addExerciseInputIndex, activeDraftExercise,
                                confirmWorkExerciseDeletionIndex, lastExerciseIndex,
                                routineStarted
                            )))}
                        </Table.Body>
                    </Table>
                </Accordion.Content>
            </Segment>
        )
    }

    storeSeriesData(j, i, k,z, name, value, reps) {
        const {blockGroupers} = this.state
        blockGroupers[j].blocks[i].exercises[k].effectiveSeries[z]={
            ...blockGroupers[j].blocks[i].exercises[k].effectiveSeries[z],
            [name]: value
        }
        if (reps) {
            blockGroupers[j].blocks[i].exercises[k].effectiveSeries[z].reps = reps
        }
        this.setState({blockGroupers: [...blockGroupers]})
    }

    renderExerciseTableSeries(j, i, k, e, routineStarted) {
        // let previousKg = 'Sin peso de referencia'
        // if (e.rounds) {
        //     previousKg = e.rounds[e.rounds.length-1].kgs
        // }
        // this.setState({executeWithReps: {...e, previousKg, j,i,k}})
        //
        // /*
        // const ex = blockGroupers[executeWithReps.j].blocks[executeWithReps.i].exercises[executeWithReps.k]
        //                 if (ex.rounds) {
        //                     ex.rounds.push({effectiveReps:parseInt(effectiveReps,10),kgs:parseInt(kgs,10)})
        //                 } else {
        //                     ex.rounds=[{effectiveReps:parseInt(effectiveReps,10),kgs:parseInt(kgs,10)}]
        //                 }
        //                 this.setState({blockGroupers,executeWithReps: null})
        //  */

        const rows = []
        for (let z = 0; z < e.series; z++) {
            rows.push(<>
                <Table.Row key={z}>
                    <Table.Cell>
                        <Input
                            disabled={!routineStarted}
                            className={'size-two-digits align-center'}
                            placeholder={e.reps}
                            value={e.effectiveSeries[z]?.reps}
                            name={'reps'}
                            onChange={(e, {value,name}) => this.storeSeriesData(j,i,k,z,name,value)}
                        />
                    </Table.Cell>
                    <Table.Cell>
                        <Input
                            disabled={!routineStarted}
                            className={'size-two-digits align-center'}
                            placeholder={e[e.currentWorkRange+'LastWeight'] ?? 's/n'}
                            value={e.effectiveSeries[z]?.kgs}
                            name={'kgs'}
                            onChange={(_, {value,name}) => this.storeSeriesData(j,i,k,z,name,value, e.reps)}
                        />
                    </Table.Cell>
                </Table.Row>
            </>)
        }
        return (
            <Table unstackable basic='very' textAlign={'center'} className={'margin-top-1'}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell className={'no-padding'}>efectivas</Table.HeaderCell>
                        <Table.HeaderCell className={'no-padding'}>kg</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {/*TODO: migrate from rounds to Series (OR use both?)*/}
                    {rows}
                </Table.Body>
            </Table>
        )
    }

    renderExercise(bg, b, e, j, i, k,
                   editionMode, addExerciseInputIndex, activeDraftExercise,
                   confirmWorkExerciseDeletionIndex, lastExercise, routineStarted) {
        const hasValue = e.reps || e.secs
        return (
            <>
                <Table.Row key={k} className={'table-row-item'}>
                    <Table.Cell style={{position: 'relative'}}
                                colSpan={editionMode ? 4 : 3}
                                className={k === lastExercise ? 'last-child-no-bottom' : ''}>
                        <Grid>
                            <Grid.Column width={editionMode ? !hasValue ? 13 : 8 : 16}>
                                {e.isDraft && <div className={'label-new-item'}/>}
                                {e.link ? <Link to={'#'} onClick={() => this.openExerciseVideo(e.link)}>{e.name}</Link> : e.name}
                                <TooltipInfoButton title={
                                    <div>
                                        <p><b>Rango de fuerza: {e.forceLastWeight ?? 'sin datos'}</b></p>
                                        <p><b>Rango de hipertrofia: {e.hypertrophyLastWeight ?? 'sin datos'}</b></p>
                                        <p><b>Rango de resistencia: {e.resistenceLastWeight ?? 'sin datos'}</b></p>
                                    </div>
                                }/>
                                {
                                    e.series && e.reps && !editionMode &&
                                    this.renderExerciseTableSeries(j, i, k, e, routineStarted)
                                }
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
                                            {hasValue && <span>
                                                {e.series ? e.series +'x' : ''}
                                                {(e.reps ? e.reps+' Reps' : e.secs+' Segs')}
                                            </span>}
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
                        {editionMode && this.renderAddExercise(bg, b, addExerciseInputIndex, j,i,k)}
                    </Table.Cell>
                    {
                        (e.reps || e.secs) && !editionMode &&
                        <Table.Cell className={k === lastExercise ? 'last-child-no-bottom' : ''}>
                            {e.series ? e.series +'x' : ''}{e.reps ? e.reps+' Reps' : e.secs+' Segs'}
                        </Table.Cell>
                    }
                    {
                        routineStarted && e.secs &&
                        <Table.Cell className={k === lastExercise ? 'last-child-no-bottom' : ''}>
                            <Icon className={'table-play'} name={'play'} onClick={() => this.startExercise(e,j,i,k)}/>
                        </Table.Cell>
                    }
                </Table.Row>
                {this.renderAddExerciseInputs(bg, b, addExerciseInputIndex, j,i,k, activeDraftExercise)}
            </>
        )
    }

    async copyTemplateRoutineToPlanification(planificationId) {
        try {
            const {state: {routineId}} = this.context
            await copyTemplateRoutineToPlanification({templateRoutineId: routineId, planificationId})
            this.setState({openCopyToPlanificationModal: false})
            showSuccess(this.context, '', 'Rutina copiada a la planificacion!')
        } catch (e) {
            console.error(e)
        }
    }

    cancelRoutineExecution() {
        this.setState({routineStarted: false})
        this.setSecondaryActions()
        showSuccess(this.context, '', 'Ejecucion cancelada!')
    }

    executeWorkGroup(b, j, i) {
        const queue = []
        for (let k = b.exercises.length-1; k >= 0; k--) {
            const e = b.exercises[k]
            queue.push({e,j,i,k})
            if (b.exerestinterval && k > 0) {
                queue.push({e:{name: 'Descanso', secs: b.exerestinterval}})
            }
        }
        this.setState({nextQueuedIntervals: queue})
    }

    startRoutine() {
        this.activateAllIndexes()
        this.generateAllExerciseGrids()
        this.context.dispatch(setData({secondaryActions: []}))
        this.setState({routineStarted: true})
    }

    finishRoutine() {
        this.setState({showBorgScale: true})
    }

    async confirmBorgScale(s) {
        try {
            const {state: {permissions: {canSaveRoutineExecution}}} = this.context
            if (!canSaveRoutineExecution) {
                return
            }

            const {blockGroupers, routineId, planificationId} = this.state
            const exercises = []
            for (let i = 0; i < blockGroupers.length; i++) {
                const bg = blockGroupers[i]
                for (let j = 0; j < bg.blocks.length; j++) {
                    const b = bg.blocks[j]
                    for (let k = 0; k < b.exercises.length; k++) {
                        const e = b.exercises[k]
                        if(e.rounds){
                            for (let l = 0; l < e.rounds.length; l++) {
                                const r = e.rounds[l]
                                exercises.push({
                                    id: e.exId,
                                    reps: e.reps,
                                    effectiveReps: parseInt(r.reps,10),
                                    kg: parseInt(r.kgs,10)
                                })
                            }
                        } else if(e.series) {
                            for (let l = 0; l < e.effectiveSeries.length; l++) {
                                const r = e.effectiveSeries[l]
                                exercises.push({
                                    id: e.exId,
                                    reps: e.reps,
                                    effectiveReps: parseInt(r.reps,10),
                                    kg: parseInt(r.kgs,10)
                                })
                            }
                        } else if(e.reps && b.laps) {
                            for (let l = 0; l < b.laps; l++) {
                                exercises.push({
                                    id: e.exId,
                                    reps: e.reps,
                                    effectiveReps: e.reps,
                                    kg: 0
                                })
                            }
                        }
                    }
                }
            }

            await saveRoutineExecution({planificationId, routineId, exercises, rpe: s})
            this.setState({showBorgScale:false, routineStarted: false})
            this.setSecondaryActions()
            showSuccess(this.context, '', 'Ejecucion de rutina guardada con exito!')
        } catch (e) {
            console.error(e)
        }
    }

    async uploadRoutineImage(file) {
        try {
            const {state: {isTemplate}} = this.context
            const {routineId, planificationId} = this.state
            const res = await uploadRoutineImage(routineId, planificationId, file, isTemplate)
            this.context.dispatch(setData({coverImageUrl: res.data, loadCoverImage: true}))
            this.setState({showCropper: false, toCrop: null})
        } catch (e) {
            showError(this.context, 'Error al subir imagen', 'No se pudo subir la imagen de la rutina')
        }
    }

    async routineImageCropper(file) {
        try {
            this.setState({showCropper: true, showUploadRoutineImage:false, toCrop:file})
        } catch (e) {
            showError(this.context, 'Error al subir imagen', 'No se pudo subir la imagen de la rutina')
        }
    }

    renderRoutineDetails() {
        const {state: {permissions: {editRoutine}}} = this.context
        const {
            confirmBlockGroupDeletionIndex,
            confirmWorkDeletionIndex,
            confirmWorkExerciseDeletionIndex,
            addExerciseInputIndex,
            activeDraftExercise,
            editionMode,
            actionable,
            canEdit,
            blockGroupers,
            activeIndexes,
            showCreateBlockModal,
            nextBlockNumber,
            showModalCopyLink,
            routineLink,
            openCopyToPlanificationModal,
            routineStarted,
            executeWithTimer,
            nextQueuedIntervals,
            showBorgScale,
            showUploadRoutineImage,
            showCropper
        } = this.state;

        return (
            <>
                {actionable && showUploadRoutineImage && <ImageUpload onFileSelected={(file) => this.routineImageCropper(file)}/>}
                {actionable && showCropper && <ImageCropper toCrop={this.state.toCrop}
                                              onCancel={() => this.setState({showCropper: false, toCrop: null, showUploadRoutineImage:true})}
                                              onConfirm={(img) => this.uploadRoutineImage(img)}/>}
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
                                    bg, b, j, i,
                                    editionMode, activeIndexes, confirmWorkDeletionIndex,
                                    addExerciseInputIndex, activeDraftExercise, confirmWorkExerciseDeletionIndex,
                                    routineStarted
                                )))}
                            </div>
                            <Divider horizontal>
                                {
                                    (!editionMode && !routineStarted && actionable) ?
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
                    openCopyToPlanificationModal &&
                    <ModalRoutineToPlanificationCopy
                        handleClose={() => this.setState({openCopyToPlanificationModal: false})}
                        handleConfirm={(planificationId) => this.copyTemplateRoutineToPlanification(planificationId)}
                    />
                }
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
                {
                    (executeWithTimer || nextQueuedIntervals) &&
                    <ModalExerciseExecuteTimer
                        {...executeWithTimer}
                        queue={nextQueuedIntervals}
                        onFinished={() => this.setState({executeWithTimer: null, nextQueuedIntervals: null})}/>
                }
                {showBorgScale && <ModalBorgScale onConfirm={s => this.confirmBorgScale(s)} onCancel={() => this.setState({showBorgScale: false})}/>}
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