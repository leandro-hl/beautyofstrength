import React, {Component, useState} from "react";
import {
    Advertisement,
    Button,
    Grid,
    Header,
    Icon,
    Input,
    List,
    Loader, Menu,
    Message,
    Modal,
    Segment
} from "semantic-ui-react";
import {
    createPlanification,
    deletePlanification,
    getUserPermissions,
    inviteAthletes,
    listExercises,
    listExerciseVideos,
    listMyAthletes,
    listPlanifications,
    listQueuedPlanificationAccessRequests,
    listRoutineTemplates,
    listWorkoutTemplates,
    requestAccessToSharedPlanification,
    uploadExerciseVideoLink
} from "../service";
import {Link, withRouter} from "react-router-dom";
import {AppContext, setData, showSuccess} from "../context";
import BottomMenuBar from "./BottomMenuBar";
import LayoutMobile from "./LayoutMobile";
import {MENU} from "../enums";
import {ModalPlanificationCreate} from "./ModalPlanificationCreate";
import {ModalPlanificationRequestAccess} from "./ModalPlanificationRequestAccess";
import {ModalPlanificationsPendingRequests} from "./ModalPlanificationsPendingRequests";
import {PopUpConfirmation} from "./PopUpConfirmation";
import {Chip} from "./Chip";
import {ModalExerciseVideoLinkUpload} from "./ModalExerciseVideoLinkUpload";
import {isLocalhost} from "../functions";

const MenuHeaderRender = ({onMenuChange}) => {
    const [activeItem, setActiveItem] = useState(1)
    return <>
        <Menu pointing secondary className={'tab-menu-header'}>
            <Menu.Item
                name='rutinas'
                active={activeItem === 1}
                onClick={() => {
                    setActiveItem(1)
                    onMenuChange(1)
                }}
            />
            {/*<Menu.Item*/}
            {/*    name='bloques'*/}
            {/*    active={activeItem === 2}*/}
            {/*    onClick={() => {*/}
            {/*        setActiveItem(2)*/}
            {/*        onMenuChange(2)*/}
            {/*    }}*/}
            {/*/>*/}
            <Menu.Item
                name='videos'
                active={activeItem === 3}
                onClick={() => {
                    setActiveItem(3)
                    onMenuChange(3)
                }}
            />
            <Menu.Item
                name='athletes'
                active={activeItem === 4}
                onClick={() => {
                    setActiveItem(4)
                    onMenuChange(4)
                }}
            />
        </Menu>
    </>
}

class PageCreateSuite extends Component {
    static contextType = AppContext
    state = {loading: true, title: 'Mis Rutinas', message: 'Crea rutinas que pueden ser usadas en cualquier planificacion'}

    async componentDidMount() {
        try {
            this.setTopBar()
            await this.setRoutinesContext()
        } catch (e) {
            console.error(e)
        }
    }

    async setRoutinesContext() {
        try {
            this.context.dispatch(setData({
                noBottomBar: false,
                secondaryActions: [
                    {
                        func: () => this.createNewRoutine(),
                        description: <span><Icon name={'plus'}/> Nueva Rutina</span>}
                ],
                menuButtonSelected: MENU.INSTRUCTOR_SUITE}))
            const res = await listRoutineTemplates()
            this.setState({show: 1,title: 'Mis Rutinas',message: 'Crea rutinas que pueden ser usadas en cualquier planificacion', loading: false, routines: res.data})
        } catch (e) {
            console.error(e)
        }
    }

    redirectToRoutine(id) {
        if (id) {
            this.context.dispatch(setData({routineId: id, isTemplate: true, isOwner: true}, true))
            this.props.history.push('/routine')
        }
    }

    redirectToWorkout(id) {
        if (id) {
            this.context.dispatch(setData({routineId: id, isTemplate: true}, true))
            this.props.history.push('/routine')
        }
    }

    createNewRoutine() {
        const {routines} = this.state;
        this.context.dispatch(setData({
            routineId: null,
            routineNumber: routines.length+1,
            isTemplate: true,
            isOwner: true,
            routineName: 'Rutina Nro '+ (routines.length+1)}))
        this.props.history.push('/routine/create')
    }

    createNewBlock() {

    }

    async onMenuChanged(i) {
        const {routines, workouts, videos, athletes} = this.state;
        switch (i) {
            case 1:
                if (!routines) {
                    const res = await listRoutineTemplates()
                    this.setState({loading: false, routines: res.data})
                }
                this.context.dispatch(setData({
                    secondaryActions: [
                        {
                            func: () => this.createNewRoutine(),
                            description: <span><Icon name={'plus'}/> Nueva Rutina</span>}
                    ]}))
                this.setState({title: 'Mis Rutinas', message: 'Crea rutinas que pueden ser usadas en cualquier planificacion', show: 1})
                break
            case 2:
                if (!workouts) {
                    const res = await listWorkoutTemplates()
                    this.setState({loading: false, workouts: res.data})
                }
                this.context.dispatch(setData({
                    secondaryActions: [
                        {
                            func: () => this.createNewBlock(),
                            description: <span><Icon name={'plus'}/> Nuevo Bloque</span>}
                    ]}))
                this.setState({title: 'Mis Bloques', message: '', show: 2})
                break
            case 3:
                if (!videos) {
                    const res = await listExercises()
                    this.setState({loading: false, videos: res.data.exercises})
                }
                this.context.dispatch(setData({secondaryActions: []}))
                this.setState({title: 'Mis Videos', message: 'Asocia videos a ejercicios para que tus rutinas cobren vida', show: 3})
                break
            case 4:
                const res = await listMyAthletes()
                this.setState({loading: false, athletes: res.data})
                this.context.dispatch(setData({secondaryActions: [
                        {
                            func: () => this.inviteAthletes(),
                            description: <span><Icon name={'share alternate'}/> Invitar Atletas</span>}
                    ]}))
                this.setState({title: 'Mis Atletas', message: 'Administra tus atletas. Invitalos para que descarguen la aplicacion con tu logo', show: 4})
                break
        }
    }

    async inviteAthletes() {
        let res = {}
        try {
            res = await inviteAthletes()

            if (isLocalhost()) {
                await navigator.clipboard.writeText(`localhost:3000/app${res.data}`);
            } else {
                await navigator.clipboard.writeText(`https://bos.team/app${res.data}`);
            }
            showSuccess(this.context, '', 'Link copiado al portapapeles!')
        } catch (e) {
            console.error(e)
            this.setState({inviteLink: `${isLocalhost() ? 'localhost:3000/app' : 'https://bos.team/app'}${res.data}`, showModalCopyLink: true})
        }
    }

    componentWillUnmount() {
        this.context.dispatch(setData({
            removeMenuHeaderPadding: false
        }))
    }

    setTopBar() {
        this.context.dispatch(setData({
            MenuHeaderRender: <MenuHeaderRender onMenuChange={(i) => this.onMenuChanged(i)}/>,
            removeMenuHeaderPadding: true
        }))
    }

    openExerciseVideo(videoCode) {
        this.context.dispatch(setData({videoCode: videoCode}))
    }

    async uploadExerciseVideoLink(link) {
        try {
            const {exerciseToUploadLinkTo, i, videos} = this.state
            const res = await uploadExerciseVideoLink({id: exerciseToUploadLinkTo.id, link})
            videos[i].nocurrentuservideo= false
            videos[i].link= res.data.link
            this.setState({openModalUploadExerciseVideoLink: false, exerciseToUploadLinkTo: null, i: null})
            showSuccess(this.context, '', 'Link subido con exito!')
        } catch (e) {
            console.error(e)
        }
    }

    openModalUploadExerciseVideoLink(e, i) {
        this.setState({openModalUploadExerciseVideoLink: true, exerciseToUploadLinkTo: e, i})
    }

    render() {
        const {state: {permissions: {}}} = this.context
        const {
            loading,
            routines,
            workouts,
            openModalUploadExerciseVideoLink,
            exerciseToUploadLinkTo,
            videos,
            athletes,
            title,
            show,
            showModalCopyLink,
            inviteLink, message} = this.state;

        if (loading) {
            return <Loader active/>
        }

        return (
            <>
                <Message content={message}/>
                <Header as={'h5'}>{title}</Header>
                {show === 1 && routines.map((p,i) => {
                    return (
                        <Segment style={{width: '100%'}} key={p.id} onClick={() => this.redirectToRoutine(p.id)}>
                            {p.name}
                        </Segment>
                    )
                })}
                {/*{show === 2 && workouts.map((p,i) => {*/}
                {/*    return (*/}
                {/*        <Segment style={{width: '100%'}} key={p.id} onClick={() => this.redirectToWorkout(p.id)}>*/}
                {/*            {p.name}*/}
                {/*        </Segment>*/}
                {/*    )*/}
                {/*})}*/}
                {show === 3 && videos.map((e,i) => {
                    return (
                        <Segment style={{width: '100%'}} key={e.id}>
                            <Grid>
                                <Grid.Row>
                                    {
                                        e.nocurrentuservideo ?
                                            <>
                                                <Grid.Column width={11}>
                                                    {e.name}
                                                </Grid.Column>
                                                <Grid.Column width={5} className={'no-padding'}>
                                                    <Button
                                                        onClick={() => this.openModalUploadExerciseVideoLink(e, i)}
                                                        basic secondary icon='plus' style={{position: 'relative', float: 'right'}}/>
                                                </Grid.Column>
                                            </> : <Grid.Column>
                                                <Link to={'#'} onClick={() => this.openExerciseVideo(e.link)}>{e.name}</Link>
                                            </Grid.Column>
                                    }
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    )
                })}
                {show === 4 && athletes.map((e,i) => {
                    return (
                        <Segment style={{width: '100%'}} key={i}>
                            <Header sub>{e.name}</Header>
                            {e.plan}
                        </Segment>
                    )
                })}
                {
                    showModalCopyLink &&
                    <Modal dimmer={'blurring'} size="mini" open={showModalCopyLink} onClose={() => this.setState({showModalCopyLink: false, inviteLink:null})}>
                        <Modal.Header>Link Generado!</Modal.Header>
                        <Modal.Content style={{lineBreak: 'anywhere'}}>
                            <p>{inviteLink}</p>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button secondary onClick={() => this.setState({showModalCopyLink: false, inviteLink:null})}>Cerrar</Button>
                        </Modal.Actions>
                    </Modal>
                }
                <ModalExerciseVideoLinkUpload
                    open={openModalUploadExerciseVideoLink}
                    item={exerciseToUploadLinkTo}
                    handleClose={() => this.setState({openModalUploadExerciseVideoLink: false, exerciseToUploadLinkTo: null, i: null})}
                    handleConfirm={(link)=> this.uploadExerciseVideoLink(link)}/>
            </>
        )
    }
}

export default withRouter(PageCreateSuite);