import React, {Component} from "react";
import {Button, Header, Icon, Loader, Message, Segment} from "semantic-ui-react";
import {listRoutines} from "../service";
import {withRouter} from "react-router-dom";
import {queryParam} from "../functions";
import {TopMenuBar} from "./TopMenuBar";
import {AppContext, setData} from "../context";
import BottomMenuBar from "./BottomMenuBar";
import LayoutMobile from "./LayoutMobile";

class PagePlanificationDetail extends Component {
    static contextType = AppContext

    constructor(props) {
        super(props);
        this.state = {loading: true, routines: [], planificationId:null}
    }

    async componentDidMount() {
        try {
            const {state: {planificationId, permissions: {createManyRoutines}}} = this.context
            const res = await listRoutines(planificationId);

            const secondaryActions = [
                {disabled: !createManyRoutines && res.data.length>0,func: () => this.redirectToCreateRoutine(), description: 'Agregar una Rutina'}
            ]
            this.context.dispatch(setData({secondaryActions: secondaryActions}))
            this.setState({loading: false, routines: res.data, planificationId})
        } catch (e) {
            console.error(e)
        }
    }

    redirectToRoutine(id) {
        this.context.dispatch(setData({routineId: id}))
        this.props.history.push('/routine')
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

    render() {
        const {state: {planificationName}} = this.context
        const {routines} = this.state;
        const {loading} = this.state;

        if (loading) {
            return <Loader active/>
        }

        return (
            <>
                <Header as={'h3'}>
                    <Button className={'header-back-arrow'} icon onClick={() => this.props.history.push('/my-planifications')}>
                        <Icon name={'arrow left'}/>
                    </Button>
                    <span>{planificationName ?? 'Mis Rutinas'}</span>
                </Header>
                {
                    !routines.length &&
                    <Message>
                        <Message.Header>Sin Rutinas</Message.Header>
                        <p>Comienza agregando una rutina a tu planificacion. Usualmente una rutina es un dia de la semana.</p>
                    </Message>
                }
                {routines.map(p => (<Segment style={{width: '100%'}} key={p.id} onClick={() => this.redirectToRoutine(p.id)}>{p.name}</Segment>))}
            </>
        )
    }
}

export default withRouter(PagePlanificationDetail);