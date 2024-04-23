import React, {Component, useContext, useState} from "react";
import {
    Button,
    Checkbox,
    Divider,
    Grid,
    Header,
    Icon,
    Input,
    List,
    Loader, Menu,
    Message,
    Modal,
    Popup, Radio,
    Segment
} from "semantic-ui-react";
import {
    actionateRoutine,
    getPlanificationDetails,
    repeatLastMesocycle,
    savePlanificationEditions,
    sharePlanification
} from "../service";
import {withRouter} from "react-router-dom";
import {isLocalhost} from "../functions";
import {AppContext, setData, showSuccess} from "../context";
import {ModalRoutineActionatedConfirmation} from "./ModalRoutineActionatedConfirmation";
import {Chip} from "./Chip";
import {PopUpDisabledAction} from "./PopUpDisabledAction";
import {PopUpContinueEditing} from "./PopUpContinueEditing";
import {PopUpConfirmation} from "./PopUpConfirmation";
import {ModalBorgScale} from "./ModalBorgScale";
import {ReactComponent as EditIcon} from '../icons/edit.svg'
import {ReactComponent as ShareIcon} from '../icons/share.svg'
import {ReactComponent as BackArrowIcon} from '../icons/arrow_back.svg'

const MenuHeaderRender = ({
                              isEditable,
                              discardPlanificationChanges,
                              onSharePlanification,
                              enableEditionPlanification,
                              savePlanificationEditions,
                              onBackArrow
                          }) => {
    const {state: {planificationName, isOwner, permissions: {sharePlanification, editPlanification}}} = useContext(AppContext)

    const [editionMode, setEditionMode] = useState(false)
    const [savingEditions, setSavingEditions] = useState(false)
    const actionable = isOwner
    const canEdit = !editionMode //&& isEditable
    const canShare = !editionMode && sharePlanification && actionable
    const savingMode = editionMode && editPlanification && actionable //&& isEditable

    return (
        <>
            {
                !editionMode &&
                <Button className={'header-back-arrow'} icon onClick={() => onBackArrow()}>
                    <BackArrowIcon/>
                </Button>
            }
            {
                editionMode &&
                <PopUpContinueEditing onDiscardChanges={() => {
                    discardPlanificationChanges()
                    setEditionMode(false)
                }}/>
            }
            <span>{planificationName ?? 'Mis Rutinas'}</span>
            {
                canShare &&
                <ShareIcon className={'header-icon'} onClick={() => onSharePlanification()}/>
            }
            {
                (!editionMode && actionable) ?
                    editPlanification ?
                        canEdit ?
                            <EditIcon className={'header-icon'} onClick={() => {
                                setEditionMode(true)
                                enableEditionPlanification()
                            }}/>
                            :
                            <PopUpDisabledAction
                                disableHeader={'No es posible editar'}
                                disableDescription={'Tu o un atleta ya marcaron una rutina de esta planificacion'}
                                trigger={<EditIcon className={'header-icon disabled-btn'}/>}/>
                        : <PopUpDisabledAction trigger={<EditIcon className={'header-icon disabled-btn'}/>}/>
                    : null
            }
            {
                savingMode &&
                <Icon disabled={savingEditions} name={'save outline'} className={'header-icon'} onClick={async () => {
                    setSavingEditions(true)
                    await savePlanificationEditions()
                    setEditionMode(false)
                    setSavingEditions(false)
                }}/>
            }
        </>
    )
}

class PagePlanificationDetail extends Component {
    static contextType = AppContext

    constructor(props) {
        super(props);
        this.state = {
            changes: false,
            loading: true,
            routines: [],
            planificationId:null,
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
            const res = await getPlanificationDetails(planificationId);
            const week = res.data.week.split('').map(d => parseInt(d, 10))
            for (let i = 0; i < days.length; i++) {
                days[i].checked = week.indexOf(i)!==-1
            }

            this.setState({
                loading: false,
                days: days,
                daysBackup: days.map(d => ({...d})),
                mesocycle: res.data.mesocycle,
                objective: res.data.objective,
                week: week,
                routines: res.data.routines,
                routinesBackup: res.data.routines.map(d => ({...d})),
                isEditable: res.data.isEditable,
                planificationId})
            this.setSecondaryActions()
            this.setTopBar()
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

    redirectToRoutine(id, coverImageUrl) {
        if (id) {
            this.context.dispatch(setData({routineId: id, isTemplate: false, coverImageUrl}, true))
            this.props.history.push('/routine')
        }
    }

    redirectToCreateRoutine() {
        const {routines} = this.state;
        this.context.dispatch(setData({
            routineId: null,
            isTemplate: false,
            routineNumber: routines.length+1,
            routineName: 'Dia '+ (routines.length+1)}))
        this.props.history.push('/routine/create')
    }

    async sharePlanification() {
        let res = {}
        try {
            const {planificationId} = this.state
            res = await sharePlanification({planificationId})

            if (isLocalhost()) {
                await navigator.clipboard.writeText(`localhost:3000/app${res.data}`);
            } else {
                await navigator.clipboard.writeText(`https://bos.team/app${res.data}`);
            }
            showSuccess(this.context, '', 'Link copiado al portapapeles!')
        } catch (e) {
            console.error(e)
            this.setState({planificationLink: `${isLocalhost() ? 'localhost:3000/app' : 'https://bos.team/app'}${res.data}`, showModalCopyLink: true})
        }
    }

    async confirmBorgScale(s) {
        const {actionatedRoutineInfo}=this.state
        const payload = {...actionatedRoutineInfo, rpe: s}
        await this.actionateRoutine(payload)
        this.setState({showBorgScale:false, actionatedRoutineInfo: null})
    }

    async actionateRoutine(info) {
        try {
            const {routines, planificationId} = this.state;
            const res = await actionateRoutine({...info, planificationId})
            const buffer = [...routines]
            if (info.actionatedRoutineAction === 'skip') {
                buffer[info.actionatedRoutineIndex].completed=false
                showSuccess(this.context, '', 'Rutina omitida!')
            } else {
                buffer[info.actionatedRoutineIndex].completed=true
                showSuccess(this.context, '', 'Rutina completada!')
            }
            buffer[info.actionatedRoutineIndex].isActionable=false
            this.setState({routines: [...buffer]})
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
            const {changes} = this.state
            if(changes) {
                this.setState({savingEditions: true})
                const {days, routinesToDelete, planificationId, newMesocycle, newObjective} = this.state;
                const week = []
                for (let i = 0; i < days.length; i++) {
                    if (days[i].checked) {
                        week.push(i.toString())
                    }
                }
                await savePlanificationEditions({
                    planificationId,
                    week,
                    routinesToDelete,
                    newObjective,
                    newMesocycle:parseInt(newMesocycle, 10)})
                await this.refresh()
                showSuccess(this.context, '', 'Planificacion actualizada!')
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

    async repeatLastMesocycle() {
        try {
            const {planificationId, repeatWeekOnly} = this.state;
            await repeatLastMesocycle({planificationId, onlyWeek: !!repeatWeekOnly})
            showSuccess(this.context, '', 'Generando nuevas rutinas, puede tardar unos minutos!')
        } catch (e) {
            console.error(e)
        } finally {
            this.setState({showPopUpCopyMesocycle: false})
        }
    }

    setTopBar() {
        this.context.dispatch(setData({
            MenuHeaderRender: <MenuHeaderRender
                isEditable={this.state.isEditable}
                discardPlanificationChanges={() => this.discardPlanificationChanges()}
                onSharePlanification={() => this.sharePlanification()}
                enableEditionPlanification={() => this.enableEditionPlanification()}
                savePlanificationEditions={() => this.savePlanificationEditions()}
                onBackArrow={() => this.props.history.push('/my-planifications')}
            />
        }))
    }

    render() {
        const {state: {planificationName, isOwner, permissions: {sharePlanification, editPlanification, repeatLastMesocycle, canMarkRoutine}}} = this.context
        const {
            loading,
            isEditable,
            editionMode,
            savingEditions,
            days,
            mesocycle,
            objective,
            week,
            routines,
            showPopUpCopyMesocycle,
            showDiscardChangesConfirmation,
            confirmRoutineDeletionIndex,
            showModalRoutineActionated,
            showModalCopyLink,
            planificationLink,
            actionatedRoutineId,
            actionatedRoutineAction,
            actionatedRoutineIndex,
            showBorgScale,
            repeatWeekOnly} = this.state;

        if (loading) {
            return <Loader active/>
        }

        const repeatWeekOnlyFunc = (e, { name, value }) => this.setState({repeatWeekOnly: name === 'yes' && value})
        let mesocycleNumber=1
        const menuItems = []
        for (let i = 0; i < routines.length; i++) {
            if (i%mesocycle === 0) {
                routines[i].initMesocycle=true
                routines[i].mesocycleNumber=mesocycleNumber
                menuItems.push(<Menu.Item fitted={'horizontally'} as={'a'} href={'#M'+mesocycleNumber}>{mesocycleNumber}</Menu.Item>)
                mesocycleNumber++
            }
        }

        let weekNumber = 1
        let nextDefaultRoutineCover=1
        return (
            <>
                <Menu compact vertical borderless className={'planification-mesocycle-index'}>
                    <Menu.Item header fitted={'horizontally'}>M</Menu.Item>
                    {menuItems}
                </Menu>
                <Header as={'h5'} className={'no-top-margin'}>
                    Dias
                    {
                        !editionMode && isOwner && repeatLastMesocycle &&
                        <PopUpConfirmation
                            title={'Repetir Rutinas? Repeti las rutinas de ultima/o:'}
                            primary={'Confirmar'}
                            secondary={'Cancelar'}
                            isManaged
                            open={showPopUpCopyMesocycle}
                            trigger={<Icon disabled={savingEditions}
                                           name={'refresh'} className={'header-icon'}
                                           onClick={() => this.setState({showPopUpCopyMesocycle: true})}/>}
                            onPrimaryAction={() => this.repeatLastMesocycle()}
                            onSecondaryAction={() => this.setState({showPopUpCopyMesocycle: false})}>
                            <div className={'margin-bottom-1'}>
                                Puedes repetir rutinas una vez por dia en esta planificacion
                            </div>
                            <div className={'margin-bottom-half'}>
                                <Radio
                                    label='Semana'
                                    name='yes'
                                    value={true}
                                    checked={repeatWeekOnly}
                                    onChange={repeatWeekOnlyFunc}
                                />
                            </div>
                            <div>
                                <Radio
                                    label='Mesociclo'
                                    name='no'
                                    value={false}
                                    checked={!repeatWeekOnly}
                                    onChange={repeatWeekOnlyFunc}
                                />
                            </div>
                        </PopUpConfirmation>
                    }
                    {
                        !editionMode &&
                        <Icon name={'chart bar'} className={'header-icon'}/>
                    }
                </Header>
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
                <Segment>
                    <List>
                        <List.Item>
                            Objetivo: {editionMode ?
                            <Input
                                placeholder={objective}
                                onChange={(e, {value}) => this.setState({newObjective: value, changes: !!value})}
                            />
                            : (objective ?? 'No definido')
                        }
                        </List.Item>
                        {/*todo: if a planification is meant to be for only one person then the start date makes sense
                             but the idea is for this to be a general template to guide any athlete that wants to do it.
                             we should make this planifications discoverable by athletes in the platform in some way
                             to increment interaction between instructors and athletes. (maybe)
                             What about separating Program of Planification?
                             */}
                        {/*<List.Item>*/}
                        {/*    Fecha de inicio: A definir*/}
                        {/*</List.Item>*/}
                        <List.Item>
                            Mesociclo: {editionMode ?
                            <Input
                                type={'number'}
                                placeholder={mesocycle}
                                className={'size-two-digits align-center'}
                                onChange={(e, {value}) => this.setState({newMesocycle: value, changes: !!value})}
                            />
                            : mesocycle
                        } dias
                        </List.Item>
                    </List>
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

                    if (!p.coverImageUrl) {
                        p.coverImageUrl = 'routine-cover-default-'+nextDefaultRoutineCover+'.png'
                        if (nextDefaultRoutineCover === 6) {
                            nextDefaultRoutineCover=1
                        } else {
                            nextDefaultRoutineCover++
                        }
                    }
                    const coverStyle = {
                        border: 'unset',
                        background: `linear-gradient(180deg, rgba(18, 18, 18, 0.00) 42.53%, rgba(18, 18, 18, 0.72) 79.4%, #121212 105.29%), url(${p.coverImageUrl}) lightgray 50% / cover no-repeat`,
                    }
                    return (
                        <>
                            {
                                p.initMesocycle &&
                                <Divider horizontal id={'M'+p.mesocycleNumber}>Mesociclo {p.mesocycleNumber}</Divider>
                            }
                            {p.isStartOfWeek && <Header as={'h5'} className={p.initMesocycle? 'no-top-margin': null}>Semana {weekNumber++}</Header>}
                            <Segment style={coverStyle} className={'cover-background'} key={i} disabled={disableLookup}>
                                <Grid>
                                    <Grid.Column width={!disableLookup? 11 : 16} onClick={() => !editionMode ? this.redirectToRoutine(p.id, p.coverImageUrl) : null}>
                                        <Header sub>{p.name}{skipped? <Chip omit content={'Omitida'}/> : ''}{completed? <Chip success content={'Completada'}/> : ''}</Header>
                                        <span>
                                            {p.blockCount > 1 ? p.blockCount+' Bloques, ' : p.blockCount+' Bloque, '}
                                            {p.workCount > 1 ? p.workCount+' Trabajos' : p.workCount+' Trabajo'}
                                        </span>
                                    </Grid.Column>
                                    {
                                        (editionMode && !disableActions && isEditable) &&
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
                                        (!editionMode && !disableActions && canMarkRoutine) &&
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
                        onConfirm={(info) => info.actionatedRoutineAction === "finished"? this.setState({showBorgScale:true, actionatedRoutineInfo: info}) : this.actionateRoutine(info)}
                        onClose={() => this.setState({showModalRoutineActionated: false})}
                    />
                }
                {
                    showModalCopyLink &&
                    <Modal dimmer={'blurring'} size="mini" open={showModalCopyLink} onClose={() => this.setState({showModalCopyLink: false, planificationLink:null})}>
                        <Modal.Header>Link Generado!</Modal.Header>
                        <Modal.Content style={{lineBreak: 'anywhere'}}>
                            <p>{planificationLink}</p>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button secondary onClick={() => this.setState({showModalCopyLink: false, planificationLink:null})}>Cerrar</Button>
                        </Modal.Actions>
                    </Modal>
                }
                {showBorgScale && <ModalBorgScale onConfirm={s => this.confirmBorgScale(s)}/>}
            </>
        )
    }
}

export default withRouter(PagePlanificationDetail);