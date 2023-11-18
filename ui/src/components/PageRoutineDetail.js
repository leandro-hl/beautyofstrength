import React, {Component} from "react";
import {Accordion, Button, Divider, Header, Icon, Input, List, Loader, Popup, Segment, Table} from "semantic-ui-react";
import {Link, withRouter} from "react-router-dom";
import {getRoutineDetails, getSharedRoutineDetails, saveRoutineEditions, shareRoutine} from "../service";
import {AppContext, setData} from "../context";
import BottomMenuBar from "./BottomMenuBar";
import LayoutMobile from "./LayoutMobile";
import {capitalize, isLocalhost, queryParam} from "../functions";
import {MENU} from "../enums";
import {PopUpDisabledAction} from "./PopUpDisabledAction";
import {ModalBlockCreate} from "./ModalBlockCreate";
import {Chip} from "./Chip";
import {PopUpContinueEditing} from "./PopUpContinueEditing";
import {PopUpConfirmation} from "./PopUpConfirmation";

class PageRoutineDetail extends Component{
    static contextType = AppContext

    constructor(props) {
        super(props);
        this.state = {loading: true, name: '', blocks: [], planificationId: null, routineId: null, activeIndexes:[]}
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
                    routineDetails: {...res.data, nextBlockNumber: res.data.blockGroupers.length+1}}))
                this.context.dispatch(setData({routineId: res.data.id, shared: true}, true))
                this.setState({
                    loading: false,
                    isShared: !isShared,
                    routineId: res.data.id,
                    blockGroupers: res.data.blockGroupers,
                    name: res.data.name,
                    difficulty: res.data.difficulty,
                    duration: res.data.duration,
                    nextBlockNumber: res.data.blockGroupers.length+1})
            } else {
                const {state: {routineId, planificationId, isOwner}} = this.context
                const res = await getRoutineDetails(routineId);

                const actionable = !isShared && isOwner
                let canEdit = false
                if (actionable) {
                    canEdit = !res.data.alreadyMarkedByAthetles
                }
                this.context.dispatch(setData({
                    noBottomBar: false,
                    menuButtonSelected: MENU.PLANIFICATIONS,
                    routineDetails: {...res.data, nextBlockNumber: res.data.blockGroupers.length+1}
                }))
                this.setState({
                    loading: false,
                    planificationId,
                    isOwner,
                    routineId,
                    canEdit,
                    actionable,
                    shared: false,
                    alreadyMarkedByAthetles: res.data.alreadyMarkedByAthetles,
                    blockGroupers: res.data.blockGroupers,
                    name: res.data.name,
                    difficulty: res.data.difficulty,
                    duration: res.data.duration,
                    nextBlockNumber: res.data.blockGroupers.length+1})
                this.setSecondaryActions()
            }
        } catch (e) {
            console.error(e)
        }
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
        try {
            const {planificationId, routineId} = this.state
            const res = await shareRoutine({planificationId, routineId})

            if (isLocalhost()) {
                await navigator.clipboard.writeText(`localhost:3000/app${res.data}`);
            } else {
                await navigator.clipboard.writeText(`https://bos.team/app${res.data}`);
            }

            this.setState({showPopUp: true})
            const timeId = setTimeout(() => {
                this.setState({showPopUp: false})
                clearTimeout(timeId)
            }, 1000)
        } catch (e) {
            console.error(e)
        }
    }

    openExerciseVideo(videoCode) {
        this.context.dispatch(setData({videoCode: videoCode}))
    }

    addWorkToGrouper(bg, i) {
        try {
            this.context.dispatch(setData({nextWorkNumber: bg.blocks.length+1,newBlockGroupName: bg.name, newBlockGroupId: bg.id}, true))
            this.redirectToCreateBlock()
        } catch (e) {
            console.error(e)
        }
    }

    addBlock() {
        this.setState({ showCreateBlockModal: true });
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
            const {blockGroupers} = this.state
            this.setState({savingEditions: true})
            const {newGrouperNames, planificationId, routineId} = this.state;

            const entries = Object.entries(newGrouperNames)
                .filter(([key, value]) => value.changed === true);
            const namesPayload = entries.map(([key, value]) => ({id: parseInt(key, 10), index: value.index, name: value.newName}));

            await saveRoutineEditions({planificationId, routineId, newGrouperNames: namesPayload})

            const buf = [...blockGroupers]
            for (let i = 0; i < namesPayload.length; i++) {
                buf[namesPayload[i].index].name = namesPayload[i].name
            }
            this.setState({
                editionMode: false,
                savingEditions: false,
                blockGroupers: [...buf]
            })
            this.setSecondaryActions()
        } catch (e) {
            console.error(e)
        }
    }

    enableEditionRoutine() {
        const {blockGroupers} = this.state

        //default values for newly created inputs
        const newGrouperNames = {}
        for (let i = 0; i < blockGroupers.length; i++) {
            newGrouperNames[blockGroupers[i].id] = {changed: false, index: i, newName: blockGroupers[i].name}
        }

        this.setState({editionMode: true, newGrouperNames})
        this.context.dispatch(setData({secondaryActions: []}))
    }

    discardRoutineChanges() {
        this.setState({
            editionMode: false
        })
        this.setSecondaryActions()
    }

    setSecondaryActions(){
        const {actionable, canEdit} = this.state
        const {state: {permissions: {createManyExerciseBlocks, editRoutine}}} = this.context
        const secondaryActions = []
        if (actionable) {
            const action = {
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

    onGrouperNameChange(id, index, newName) {
        const {newGrouperNames} = this.state
        let buff = {...newGrouperNames}
        if (buff) {
            buff[id] = {changed: true, index, newName}
        } else {
            buff = {[id]: {changed: true, index, newName}}
        }
        this.setState({newGrouperNames: buff})
    }

    openDeleteBlockGroupPopUpConfirmation(i) {
        this.setState({confirmBlockGroupDeletionIndex: i})
    }

    deleteBlockGroup(id, i) {
        const {routinesToDelete, blockGroupers} = this.state
        const rBuff = [...blockGroupers]
        const deleted = rBuff.splice(i, 1)

        if (deleted[0].isStartOfWeek) {
            if (rBuff[i]) {
                rBuff[i].isStartOfWeek=true
            }
        }

        const buff = [...routinesToDelete]
        buff.push(id)

        this.setState({routinesToDelete: [...buff], routines: [...rBuff],confirmRoutineDeletionIndex: null})

    }

    renderRoutineDetails() {
        const {state: {permissions: {executeRoutine, editRoutine}}} = this.context
        const {
            name,
            confirmBlockGroupDeletionIndex,
            difficulty,
            duration,
            editionMode,
            actionable,
            canEdit,
            savingEditions,
            blockGroupers,
            activeIndexes,
            isShared,
            showPopUp,
            isOwner,
            showCreateBlockModal,
            nextBlockNumber
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
                    {name}
                    {
                        (!editionMode && actionable) &&
                        <Popup size={'small'}
                               trigger={<Icon name={'share square outline'} className={'header-icon'} onClick={() => this.shareRoutine()}/>}
                               position={'bottom right'}
                               open={showPopUp} content="Link copiado al portapapeles!" basic/>
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
                                            // transparent
                                            className={'input-header input-centered'}
                                            placeholder={bg.name}
                                            value={this.state.newGrouperNames[bg.id]?.newName}
                                            onChange={(e, {value}) => this.onGrouperNameChange(bg.id, j, value)}/>
                                        {/*<PopUpConfirmation*/}
                                        {/*    title={'Borrar bloque '+bg.name+'?'}*/}
                                        {/*    primary={'Borrar'}*/}
                                        {/*    secondary={'Cancelar'}*/}
                                        {/*    isManaged*/}
                                        {/*    open={j===confirmBlockGroupDeletionIndex}*/}
                                        {/*    trigger={<Button*/}
                                        {/*                     onClick={() => this.openDeleteBlockGroupPopUpConfirmation(j)}*/}
                                        {/*                     basic secondary icon='close' style={{position: 'relative', float: 'right'}}/>}*/}
                                        {/*    onPrimaryAction={() => this.deleteBlockGroup(bg.id, j)}*/}
                                        {/*    onSecondaryAction={() => this.setState({confirmBlockGroupDeletionIndex: null})}*/}
                                        {/*/>*/}
                                    </>
                                }
                            </Header>
                            <div>
                                {bg.blocks.map((b,i) => {
                                    const name = b.name.split(' - ')
                                    return (
                                        <Segment style={{width: '100%'}} className={'no-left-padding no-right-padding'} key={b.id}>
                                            <Accordion.Title
                                                className={'no-top-padding no-bottom-padding padding-left-1 padding-right-1'}
                                                active={activeIndexes.indexOf(j+'-'+i) !== -1}
                                                index={j+'-'+i}
                                                onClick={this.handleActiveBlocks}>
                                                {name[0]} {name[1] ? <Chip feel content={capitalize(name[1])}/> : null}
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
                                                        </Table.Row>
                                                    </Table.Header>
                                                    <Table.Body>
                                                        {b.exercises.map((e, i) => (
                                                            <Table.Row key={i}>
                                                                <Table.Cell>
                                                                    {e.videoCode ? <Link to={'#'} onClick={() => this.openExerciseVideo(e.videoCode)}>{e.name}</Link> : e.name}
                                                                </Table.Cell>
                                                                {(e.reps || e.secs) && <Table.Cell>{e.reps ? e.reps+' Reps' : e.secs+' Segs'}</Table.Cell>}
                                                            </Table.Row>
                                                        ))}
                                                    </Table.Body>
                                                </Table>
                                            </Accordion.Content>
                                        </Segment>
                                    )
                                })}
                            </div>
                            <Divider horizontal>
                                {
                                    (!editionMode && actionable) ?
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