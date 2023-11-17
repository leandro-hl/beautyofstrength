import React, {Component} from "react";
import {Button, Checkbox, Grid, Header, Icon, Loader, Message, Popup, Segment} from "semantic-ui-react";
import {actionateRoutine, listRoutines, savePlanificationEditions, sharePlanification} from "../service";
import {withRouter} from "react-router-dom";
import {isLocalhost} from "../functions";
import {AppContext, setData} from "../context";
import {ModalRoutineActionatedConfirmation} from "./ModalRoutineActionatedConfirmation";
import {Chip} from "./Chip";
import {PopUpDisabledAction} from "./PopUpDisabledAction";
import {PopUpContinueEditing} from "./PopUpContinueEditing";
import {PopUpConfirmation} from "./PopUpConfirmation";

class PagePlanificationDetail extends Component {
    static contextType = AppContext

    constructor(props) {
        super(props);
        this.state = {
            changes: false,
            loading: true,
            routines: [],
            planificationId:null,
            showPopUp: false,
            routinesToDelete:[],
            routinesBackup:[],
            days: [
                {n:'L', checked: false},
                {n:'M', checked: false},
                {n:'M', checked: false},
                {n:'J', checked: false},
                {n:'V', checked: false},
                {n:'S', checked: false},
                {n:'D', checked: false}
            ]
        }
    }

    async componentDidMount() {
        await this.refresh()
    }

    async refresh() {
        try {
            let {state: {planificationId}} = this.context

            if(!planificationId) {
                this.props.history.push('/my-planifications')
                return
            }

            const {days} = this.state;
            const res = await listRoutines(planificationId);
            const week = res.data.week.split('').map(d => parseInt(d, 10))
            for (let i = 0; i < days.length; i++) {
                days[i].checked = week.indexOf(i)!==-1
            }

            this.setState({
                loading: false,
                days: days,
                daysBackup: days.map(d => ({...d})),
                week: week,
                routines: res.data.routines,
                routinesBackup: res.data.routines.map(d => ({...d})),
                isEditable: res.data.isEditable,
                planificationId})
            this.setSecondaryActions()
        } catch (e) {
            console.error(e)
        }
    }

    setSecondaryActions(){
        const {routines} = this.state;
        const {state: {isOwner, permissions: {createManyRoutines}}} = this.context
        const secondaryActions = []
        if (isOwner) {
            secondaryActions.push({
                disabled: !createManyRoutines && routines.length>0,
                func: () => this.redirectToCreateRoutine(),
                description: <span><Icon name={'plus'}/> Nueva Rutina</span>})
        }
        this.context.dispatch(setData({secondaryActions: secondaryActions, noBottomBar: false}))
    }

    redirectToRoutine(id) {
        if (id) {
            this.context.dispatch(setData({routineId: id}, true))
            this.props.history.push('/routine')
        }
    }

    redirectToCreateRoutine() {
        const {routines} = this.state;
        this.context.dispatch(setData({routineId: null, routineNumber: routines.length+1, routineDetails: {
                name: '',
                blocks: [],
                nextBlockNumber: null
            }}))
        this.props.history.push('/routine/create')
    }

    async sharePlanification() {
        try {
            const {planificationId} = this.state
            const res = await sharePlanification({planificationId})

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

    async actionateRoutine(info) {
        try {
            const {routines, planificationId} = this.state;
            const res = await actionateRoutine({...info, planificationId})
            const buffer = [...routines]
            if (info.actionatedRoutineAction === 'skip') {
                buffer[info.actionatedRoutineIndex].completed=false
            } else {
                buffer[info.actionatedRoutineIndex].completed=true
            }
            buffer[info.actionatedRoutineIndex].isActionable=false
            this.setState({routines: [...buffer]})
            //todo sucess message
        } catch (e) {
            console.error(e)
        }
    }

    enableEditionPlanification() {
        this.setState({editionMode: true})
        this.context.dispatch(setData({secondaryActions: []}))
    }

    editDay(d,i) {
        const {days} = this.state
        const buff = [...days]
        buff[i].checked = !buff[i].checked
        this.setState({days: [...buff], changes: true})
    }

    openDeleteRoutinePopUpConfirmation(i) {
        this.setState({confirmRoutineDeletionIndex: i})
    }

    deleteRoutine(id, i) {
        const {routinesToDelete, routines} = this.state
        const rBuff = [...routines]
        const deleted = rBuff.splice(i, 1)

        if (deleted[0].isStartOfWeek) {
            if (rBuff[i]) {
                rBuff[i].isStartOfWeek=true
            }
        }

        const buff = [...routinesToDelete]
        buff.push(id)

        this.setState({routinesToDelete: [...buff], routines: [...rBuff],confirmRoutineDeletionIndex: null, changes: true})
    }

    async savePlanificationEditions() {
        try {
            if(this.state.changes) {
                this.setState({savingEditions: true})
                const {days, routinesToDelete, planificationId, routines} = this.state;
                const week = []
                for (let i = 0; i < days.length; i++) {
                    if (days[i].checked) {
                        week.push(i.toString())
                    }
                }
                await savePlanificationEditions({planificationId, week, routinesToDelete})
                await this.refresh()
            }
            this.setState({
                editionMode: false,
                routinesToDelete: [],
                savingEditions: false,
                changes: false
            })
        } catch (e) {
            console.error(e)
        }
    }

    discardPlanificationChanges() {
        const {routinesBackup, daysBackup} = this.state
        this.setState({
            showDiscardChangesConfirmation: false,
            editionMode: false,
            changes: false,
            routines: routinesBackup.map(d => ({...d})),
            days: daysBackup.map(d => ({...d})),
            routinesToDelete: []})
        this.setSecondaryActions()
    }

    render() {
        const {state: {planificationName, isOwner, permissions: {sharePlanification, editPlanification}}} = this.context
        const {
            loading,
            isEditable,
            editionMode,
            savingEditions,
            days,
            week,
            routines,
            showPopUp,
            showDiscardChangesConfirmation,
            confirmRoutineDeletionIndex,
            showModalRoutineActionated,
            actionatedRoutineId,
            actionatedRoutineAction,
            actionatedRoutineIndex} = this.state;

        if (loading) {
            return <Loader active/>
        }

        const actionable = isOwner
        const canEdit = !editionMode && isEditable && editPlanification
        const canShare = !editionMode && sharePlanification && actionable
        const savingMode = editionMode && isEditable && editPlanification && actionable

        let weekNumber = 1
        return (
            <>
                <Header as={'h3'}>
                    {
                        !editionMode &&
                        <Button className={'header-back-arrow'} icon onClick={() => this.props.history.push('/my-planifications')}>
                            <Icon name={'arrow left'}/>
                        </Button>
                    }
                    {
                        editionMode &&
                        <PopUpContinueEditing onDiscardChanges={() => this.discardPlanificationChanges()}/>
                    }
                    <span>{planificationName ?? 'Mis Rutinas'}</span>
                    {
                        canShare &&
                        <Popup
                            size={'small'}
                            trigger={<Icon name={'share square outline'} className={'header-icon'} onClick={() => this.sharePlanification()}/>}
                            position={'bottom right'}
                            open={showPopUp}
                            content="Link copiado al portapapeles!" basic/>
                    }
                    {
                        (!editionMode && actionable) ?
                            canEdit ?
                            <Icon name={'edit outline'} className={'header-icon'} onClick={() => this.enableEditionPlanification()}/> :
                            <PopUpDisabledAction
                                disableHeader={'No es posible editar'}
                                disableDescription={'Tu o un atleta ya marcaron una rutina de esta planificacion'}
                                trigger={<Icon name={'edit outline'} className={'header-icon disabled-btn'}/>}/> : null
                    }
                    {
                        savingMode &&
                        <Icon disabled={savingEditions} name={'save outline'} className={'header-icon'} onClick={() => this.savePlanificationEditions()}/>
                    }
                </Header>
                <Header as={'h5'}>Dias</Header>
                <Segment>
                    <Grid>
                        <Grid.Row columns={7}>
                            {days.map((d,i) => {
                                return (
                                    <Grid.Column style={{textAlign: 'center'}}>
                                        <Header sub>{d.n}</Header>
                                        <span><Checkbox disabled={!editionMode} checked={d.checked} onChange={()=> editionMode ? this.editDay(d,i) : null}/></span>
                                    </Grid.Column>
                                )
                            })}
                        </Grid.Row>
                    </Grid>
                </Segment>
                {
                    !routines.length &&
                    <Message>
                        <Message.Header>Sin Rutinas</Message.Header>
                        <p>Comienza agregando una rutina a tu planificacion. Usualmente una rutina es un dia de la semana.</p>
                    </Message>
                }
                {routines.map((p, i) => {
                    const skipped = p.completed === false;
                    const completed = p.completed === true;
                    const disableActions = !p.isActionable;
                    const disableLookup = !p.id;
                    return (
                        <>
                            {p.isStartOfWeek && <Header as={'h5'}>Semana {weekNumber++}</Header>}
                            <Segment style={{width: '100%'}} key={i} disabled={disableLookup}>
                                <Grid>
                                    <Grid.Column width={!disableLookup? 11 : 16} onClick={() => !editionMode ? this.redirectToRoutine(p.id) : null}>
                                        <Header sub>{p.name}{skipped? <Chip omit content={'Omitida'}/> : ''}{completed? <Chip success content={'Completada'}/> : ''}</Header>
                                        <span>
                                            {p.blockCount > 1 ? p.blockCount+' Bloques, ' : p.blockCount+' Bloque, '}
                                            {p.workCount > 1 ? p.workCount+' Trabajos' : p.workCount+' Trabajo'}
                                        </span>
                                    </Grid.Column>
                                    {
                                        (editionMode && !disableActions) &&
                                        <Grid.Column width={5} className={'no-right-padding no-left-padding'}>
                                            <PopUpConfirmation
                                                title={'Borrar rutina '+p.name+'?'}
                                                primary={'Borrar'}
                                                secondary={'Cancelar'}
                                                isManaged
                                                open={i===confirmRoutineDeletionIndex}
                                                trigger={<Button disabled={disableActions}
                                                                 onClick={() => this.openDeleteRoutinePopUpConfirmation(i)}
                                                                 basic secondary icon='close' style={{position: 'relative', float: 'right'}}/>}
                                                onPrimaryAction={() => this.deleteRoutine(p.id, i)}
                                                onSecondaryAction={() => this.setState({confirmRoutineDeletionIndex: null})}
                                            />
                                        </Grid.Column>
                                    }
                                    {
                                        (!editionMode && !disableActions) &&
                                        <Grid.Column width={5} className={'no-right-padding no-left-padding'}>
                                            <Button disabled={disableActions}
                                                    onClick={() => this.setState({showModalRoutineActionated: true, actionatedRoutineIndex: i, actionatedRoutineId: p.id, actionatedRoutineAction: 'finished'})}
                                                    basic secondary icon='check' style={{position: 'relative', float: 'right'}}/>
                                            <Button disabled={disableActions}
                                                    onClick={() => this.setState({showModalRoutineActionated: true, actionatedRoutineIndex: i, actionatedRoutineId: p.id, actionatedRoutineAction: 'skip'})}
                                                    basic secondary icon='close' style={{position: 'relative', float: 'right'}}/>
                                        </Grid.Column>
                                    }
                                </Grid>
                            </Segment>
                        </>
                    )
                })}
                {
                    showModalRoutineActionated &&
                    <ModalRoutineActionatedConfirmation
                        info={{actionatedRoutineId, actionatedRoutineAction, actionatedRoutineIndex}}
                        onConfirm={(info) => this.actionateRoutine(info)}
                        onClose={() => this.setState({showModalRoutineActionated: false})}
                    />
                }
            </>
        )
    }
}

export default withRouter(PagePlanificationDetail);