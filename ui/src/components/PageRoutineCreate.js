import React, {Component, createRef} from "react";
import {
    Button,
    Divider,
    Dropdown,
    Grid,
    Header,
    Icon,
    Input,
    Label,
    List,
    Loader,
    Message,
    Segment
} from "semantic-ui-react";
import {signIn} from "../service";
import {withRouter} from "react-router-dom";
import {queryParam} from "../functions";
import {AppContext, setData} from "../context";
import BottomMenuBar from "./BottomMenuBar";
import LayoutMobile from "./LayoutMobile";
import {MENU} from "../enums";
import {ModalBlockCreate} from "./ModalBlockCreate";

const MenuHeaderRender = ({routineName, redirectToPlanification}) => {
    return <>
        <Button className={'header-back-arrow'} icon onClick={() => redirectToPlanification()}>
            <Icon name={'arrow left'}/>
        </Button>
        {routineName}
    </>
}

class PageRoutineCreate extends Component {
    static contextType = AppContext
    constructor(props) {
        super(props);
        this.state = {
            planificationId: null,
            routineName: '',
            routineNumber: null,
            loading: true,
            showCreateBlockModal: false,
            nextBlockNumber: 1
        }
    }

    async componentDidMount() {
        try {
            const {nextBlockNumber} = this.state
            const {state: {routineNumber, planificationId}} = this.context

            //todo: this should change to avoid mixing planification and routine. The routine should be able to live outside a planification.
            const routineName = 'Dia '+routineNumber

            this.context.dispatch(setData({
                secondaryActions: [
                    {func: () => this.addBlock(), description: 'Agregar Bloque'}
                ],
                noBottomBar: false,
                menuButtonSelected: MENU.PLANIFICATIONS,
                MenuHeaderRender: <MenuHeaderRender routineName={routineName} redirectToPlanification={() => this.redirectToPlanification()}/>
            }))
            this.context.dispatch(setData({routineId: null, nextBlockNumber}, true))
            this.setState({
                planificationId: planificationId,
                routineName: routineName,
                routineNumber
            })
        } catch (e) {
            console.error(e)
        } finally {
            this.setState({loading: false})
        }
    }

    addBlock() {
        this.setState({ showCreateBlockModal: true });
    }

    redirectToCreateBlock() {
        this.props.history.push('/block/create')
    }

    redirectToPlanification() {
        this.props.history.push('/planification')
    }

    handleConfirm() {
        try {
            const {newBlockName, nextBlockNumber} = this.state
            this.context.dispatch(setData({
                nextWorkNumber: 1,
                newBlockGroupName: newBlockName ? newBlockName : 'Bloque '+nextBlockNumber,
                newBlockGroupId: null}, true))
            this.redirectToCreateBlock()
        } catch (e) {
            console.error(e)
        }
        this.handleClose();
    }

    handleClose = () => {
        this.setState({ showCreateBlockModal: false });
    }

    render() {
        const {loading, showCreateBlockModal, nextBlockNumber} = this.state;

        if (loading){
            return <Loader active/>
        }

        return (
            <>
                <Message>
                    <Message.Header>Rutina Vacia</Message.Header>
                    <p>Comienza agregando algunos bloques de trabajo</p>
                </Message>
                <ModalBlockCreate
                    open={showCreateBlockModal}
                    next={nextBlockNumber}
                    onChange={(name)=> this.setState({newBlockName: name})}
                    onClose={() => this.handleClose()}
                    onConfirm={() => this.handleConfirm()}/>
            </>
        )
    }
}

export default withRouter(PageRoutineCreate);