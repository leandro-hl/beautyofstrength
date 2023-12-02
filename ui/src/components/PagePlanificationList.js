import React, {Component} from "react";
import {
    Advertisement,
    Button,
    Grid,
    Header,
    Icon,
    Input,
    List,
    Loader,
    Message,
    Modal,
    Segment
} from "semantic-ui-react";
import {
    createPlanification, deletePlanification, getUserPermissions,
    listPlanifications,
    listQueuedPlanificationAccessRequests,
    requestAccessToSharedPlanification
} from "../service";
import {withRouter} from "react-router-dom";
import {AppContext, setData, showSuccess} from "../context";
import BottomMenuBar from "./BottomMenuBar";
import LayoutMobile from "./LayoutMobile";
import {MENU} from "../enums";
import {ModalPlanificationCreate} from "./ModalPlanificationCreate";
import {ModalPlanificationRequestAccess} from "./ModalPlanificationRequestAccess";
import {ModalPlanificationsPendingRequests} from "./ModalPlanificationsPendingRequests";
import {PopUpConfirmation} from "./PopUpConfirmation";

class PagePlanificationList extends Component {
    static contextType = AppContext
    state = {loading: true, planifications: [], requests:[], planificationShared: false}

    async componentDidMount() {
        try {
            const routineShared = localStorage.getItem('routine-shared')
            if (routineShared) {
                this.props.history.push('/routine')
                return
            }
            const planificationShared = localStorage.getItem('planification-shared')
            if(planificationShared) {
                this.setState({planificationShared: true, sharedPlanification: planificationShared})
            }

            const {state: {permissions: {createPlanification}}} = this.context
            if (createPlanification) {
                this.context.dispatch(setData({
                    noBottomBar: false,
                    secondaryActions: [
                        {
                            func: () => this.setState({showCreatePlanificationModal: true}),
                            description: <span><Icon name={'plus'}/> Nueva Planificacion</span>}
                    ],
                    menuButtonSelected: MENU.PLANIFICATIONS}))
            } else {
                this.context.dispatch(setData({noBottomBar: false, secondaryActions: [], menuButtonSelected: MENU.PLANIFICATIONS}))
            }
            const res = await listPlanifications();
            const ownedPlanifications = res.data.filter(p => p.owner);
            const sharedPlanifications = res.data.filter(p => !p.owner)
            this.setState({loading: false, ownedPlanifications, sharedPlanifications})
        } catch (e) {
            console.error(e)
        }
    }

    redirectToPlanification(p) {
        this.context.dispatch(setData({planificationId: p.id, planificationName: p.name, isOwner: p.owner}, true))
        this.props.history.push('/planification')
    }

    redirectToPlanificationDays(p) {
        this.context.dispatch(setData({planificationId: p.id, planificationName: p.name, isOwner: p.owner}, true))
        this.props.history.push('/planification-days')
    }

    async createPlanification() {
        try {
            const {newPlanificationName} = this.state
            const res = await createPlanification({name: newPlanificationName});
            showSuccess(this.context, '', 'Planificacion creada!')
            this.redirectToPlanificationDays({id: res.data.id, name: newPlanificationName, owner: true})
        } catch (e) {
            console.error(e)
        }
    }

    onNewPlanificationName(value) {
        this.setState({newPlanificationName: value})
    }

    async handleConfirm() {
        await this.createPlanification()
        this.handleClose();
    }

    handleClose = () => {
        this.setState({ showCreatePlanificationModal: false });
    }

    renderCreatePlanificationModal() {
        const {showCreatePlanificationModal} = this.state
        return <ModalPlanificationCreate
            open={showCreatePlanificationModal}
            handleClose={() => this.handleClose()}
            handleConfirm={() => this.handleConfirm()}
            onNewPlanificationName={(v) => this.onNewPlanificationName(v)}/>
    }

    async requestAccessToSharedPlanification() {
        try {
            const {sharedPlanification} = this.state
            await requestAccessToSharedPlanification({sharedPlanification})
            localStorage.removeItem('planification-shared')
            showSuccess(this.context, '', 'Solicitaste acceso a la planificacion!')
        } catch (e) {
            console.error(e)
        }
    }

    onCancelRequest() {
        localStorage.removeItem('planification-shared')
    }

    async fetchPendingRequests() {
        try {
            const res = await listQueuedPlanificationAccessRequests()
            this.setState({showPendingRequests: true, requests: res.data})
        } catch (e) {
            console.error(e)
        }
    }

    async refreshPlanifications() {
        try {
            this.setState({refreshing: true})
            const res = await listPlanifications();
            const ownedPlanifications = res.data.filter(p => p.owner);
            const sharedPlanifications = res.data.filter(p => !p.owner)
            this.setState({refreshing: false, ownedPlanifications, sharedPlanifications})
            showSuccess(this.context, '', 'Lista de planificaciones actualizada!')
        } catch (e) {
            console.error(e)
        }
    }

    onRemoveRequest(i) {
        const {requests} = this.state
        const buffer = [...requests]
        buffer.splice(i, 1)
        this.setState({requests: [...buffer]})
    }

    openDeletePlanificationPopUpConfirmation(i) {
        this.setState({confirmPlanificationDeletionIndex: i})
    }

    async deletePlanification(id, i) {
        try {
            const {ownedPlanifications} = this.state
            await deletePlanification(id)
            ownedPlanifications.splice(i,1)
            this.setState({ownedPlanifications, confirmPlanificationDeletionIndex: null})
            showSuccess(this.context, '', 'Planificacion eliminada!')
        } catch (e) {
            console.error(e)
        }
    }

    render() {
        const {state: {permissions: {createPlanification, sharePlanification, deletePlanification}}} = this.context
        const {ownedPlanifications, sharedPlanifications , planificationShared, showPendingRequests, requests, refreshing, confirmPlanificationDeletionIndex} = this.state;
        const {loading} = this.state;

        if (loading) {
            return <Loader active/>
        }

        return (
            <>
                <Header as={'h3'}>
                    Mis Planificaciones
                    <Icon disabled={refreshing} name={'refresh'} className={'header-icon'} onClick={() => this.refreshPlanifications()}/>
                </Header>
                {sharePlanification && <Button primary fluid onClick={() => this.fetchPendingRequests()}>Revisar solicitudes pendientes</Button>}
                {refreshing && <Loader active/>}
                {
                    !refreshing &&
                    <>
                        <Header as={'h5'}>Compartidas conmigo</Header>
                        {
                            sharedPlanifications.length === 0 &&
                            <Message>
                                <Message.Header>Aun no te han compartido ninguna planificacion</Message.Header>
                                <p>Cuando un instructor comparta una planificacion con vos, la veras aqui.</p>
                            </Message>
                        }
                        {sharedPlanifications.map((p,i) => {
                            return (
                                <Segment style={{width: '100%'}} key={p.id}
                                         onClick={() => this.redirectToPlanification(p)}>
                                    <Header sub>{p.name}</Header>
                                    <span>Rutinas: {p.routinescount}</span>
                                </Segment>
                            )
                        })}
                        <Header as={'h5'}>Creadas</Header>
                        {ownedPlanifications.map((p,i) => {
                            const canDelete = deletePlanification && !p.starred
                            return (
                                <Segment style={{width: '100%'}} key={i}>
                                    <Grid>
                                        <Grid.Column width={canDelete ? 11 : 16} onClick={() => this.redirectToPlanification(p)}>
                                            <Header sub>
                                                {p.name}
                                                {p.starred && <Icon name={'star'} className={'header-icon starred'}/> }
                                            </Header>
                                            <span>Rutinas: {p.routinescount}</span>
                                        </Grid.Column>
                                        {
                                            canDelete &&
                                            <Grid.Column width={5} className={'no-right-padding no-left-padding'}>
                                                <PopUpConfirmation
                                                    title={'Borrar planificacion '+p.name+'?'}
                                                    primary={'Borrar'}
                                                    secondary={'Cancelar'}
                                                    isManaged
                                                    open={i===confirmPlanificationDeletionIndex}
                                                    trigger={<Button
                                                                     onClick={() => this.openDeletePlanificationPopUpConfirmation(i)}
                                                                     basic secondary icon='close' style={{position: 'relative', float: 'right'}}/>}
                                                    onPrimaryAction={() => this.deletePlanification(p.id, i)}
                                                    onSecondaryAction={() => this.setState({confirmPlanificationDeletionIndex: null})}
                                                />
                                            </Grid.Column>
                                        }
                                    </Grid>
                                </Segment>
                            )
                        })}
                    </>
                }
                {createPlanification && this.renderCreatePlanificationModal()}
                {planificationShared && <ModalPlanificationRequestAccess onCancelRequest={() => this.onCancelRequest()} onRequestAccess={() => this.requestAccessToSharedPlanification()}/>}
                {showPendingRequests && <ModalPlanificationsPendingRequests requests={requests} onRemove={(i) => this.onRemoveRequest(i)} onClose={() => this.setState({showPendingRequests: false})}/>}
            </>
        )
    }
}

export default withRouter(PagePlanificationList);