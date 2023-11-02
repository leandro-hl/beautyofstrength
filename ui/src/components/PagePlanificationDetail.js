import React, {Component} from "react";
import {Button, Grid, Header, Icon, Loader, Message, Popup, Segment} from "semantic-ui-react";
import {actionateRoutine, listRoutines, sharePlanification} from "../service";
import {withRouter} from "react-router-dom";
import {isLocalhost, queryParam} from "../functions";
import {TopMenuBar} from "./TopMenuBar";
import {AppContext, setData} from "../context";
import BottomMenuBar from "./BottomMenuBar";
import LayoutMobile from "./LayoutMobile";
import {ModalRoutineActionatedConfirmation} from "./ModalRoutineActionatedConfirmation";

class PagePlanificationDetail extends Component {
    static contextType = AppContext

    constructor(props) {
        super(props);
        this.state = {loading: true, routines: [], planificationId:null, showPopUp: false}
    }

    async componentDidMount() {
        try {
            const {state: {planificationId, isOwner, permissions: {createManyRoutines}}} = this.context
            const res = await listRoutines(planificationId);

            const secondaryActions = []
            if (isOwner) {
                secondaryActions.push({disabled: !createManyRoutines && res.data.length>0,func: () => this.redirectToCreateRoutine(), description: 'Agregar una Rutina'})
            }

            this.context.dispatch(setData({secondaryActions: secondaryActions}))
            this.setState({loading: false, routines: res.data, planificationId})
        } catch (e) {
            console.error(e)
        }
    }

    redirectToRoutine(id) {
        if (id) {
            this.context.dispatch(setData({routineId: id}))
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

    render() {
        const {state: {planificationName, isOwner, permissions: {sharePlanification}}} = this.context
        const {loading, routines, showPopUp, showModalRoutineActionated, actionatedRoutineId, actionatedRoutineAction, actionatedRoutineIndex} = this.state;

        if (loading) {
            return <Loader active/>
        }

        let weekNumber = 1
        return (
            <>
                <Header as={'h3'}>
                    <Button className={'header-back-arrow'} icon onClick={() => this.props.history.push('/my-planifications')}>
                        <Icon name={'arrow left'}/>
                    </Button>
                    <span>{planificationName ?? 'Mis Rutinas'}</span>
                    {(sharePlanification && isOwner) && <Popup size={'small'} trigger={<Icon name={'share square outline'} className={'header-icon'}
                                                                       onClick={() => this.sharePlanification()}/>} position={'bottom right'} open={showPopUp} content="Link copiado al portapapeles!" basic/>}
                </Header>
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
                                    <Grid.Column width={!disableLookup? 11 : 16} onClick={() => this.redirectToRoutine(p.id)}>
                                        <Header sub>{p.name}{skipped? ' - Omitida' : ''}{completed? ' - Completada' : ''}</Header>
                                        <span>{p.blockcount > 1 ? p.blockcount+' bloques de ejercicios' : p.blockcount+' bloque de ejercicios'}</span>
                                    </Grid.Column>
                                    {
                                        !disableActions &&
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