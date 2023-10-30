import React, {Component} from "react";
import {Button, Header, Input, List, Loader, Modal, Segment} from "semantic-ui-react";
import {createPlanification, listPlanifications} from "../service";
import {withRouter} from "react-router-dom";
import {AppContext, setData} from "../context";
import BottomMenuBar from "./BottomMenuBar";
import LayoutMobile from "./LayoutMobile";
import {MENU} from "../enums";

class PagePlanificationList extends Component {
    static contextType = AppContext
    state = {loading: true, planifications: []}

    async componentDidMount() {
        try {
            const {state: {permissions: {createPlanification}}} = this.context
            if (createPlanification) {
                this.context.dispatch(setData({
                    noBottomBar: false,
                    secondaryActions: [
                        {func: () => this.setState({showCreatePlanificationModal: true}), description: 'Agregar Planificacion'}
                    ],
                    menuButtonSelected: MENU.PLANIFICATIONS}))
            } else {
                this.context.dispatch(setData({noBottomBar: false, secondaryActions: [], menuButtonSelected: MENU.PLANIFICATIONS}))
            }
            const res = await listPlanifications();
            this.setState({loading: false, planifications: res.data})
        } catch (e) {
            console.error(e)
        }
    }

    redirectToPlanification(p) {
        this.context.dispatch(setData({planificationId: p.id, planificationName: p.name}))
        this.props.history.push('/planification')
    }

    redirectToPlanificationDays(p) {
        this.context.dispatch(setData({planificationId: p.id, planificationName: p.name}))
        this.props.history.push('/planification-days')
    }

    async createPlanification() {
        try {
            const {newPlanificationName} = this.state
            const res = await createPlanification({name: newPlanificationName});
            this.redirectToPlanificationDays({id: res.data.id, name: newPlanificationName})
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
        return (
            <Modal
                open={showCreatePlanificationModal}
                size={"tiny"}
            >
                <Modal.Header>
                    Crear Planificacion
                </Modal.Header>
                <Modal.Content>
                    <Input fluid placeholder='Nombre' onChange={(e, {value}) => this.onNewPlanificationName(value)} />
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={() => this.handleClose()}>Cancelar</Button>
                    <Button primary onClick={() => this.handleConfirm()}>Crear Planificacion</Button>
                </Modal.Actions>
            </Modal>
        )
    }

    render() {
        const {state: {permissions: {createPlanification}}} = this.context
        const {planifications} = this.state;
        const {loading} = this.state;

        if (loading) {
            return <Loader active/>
        }

        return (
            <>
                <Header as={'h3'}>Mis Planificaciones</Header>
                {planifications.map(p => (<Segment style={{width: '100%'}} key={p.id} onClick={() => this.redirectToPlanification(p)}>{p.name}</Segment>))}
                {createPlanification && this.renderCreatePlanificationModal()}
            </>
        )
    }
}

export default withRouter(PagePlanificationList);