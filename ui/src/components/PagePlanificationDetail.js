import React, {Component} from "react";
import {Button, Loader, Message, Segment} from "semantic-ui-react";
import {listRoutines} from "../service";
import {withRouter} from "react-router-dom";
import {queryParam} from "../functions";
import {MenuBar} from "./MenuBar";
import {AppContext, setData} from "../context";

class PagePlanificationDetail extends Component {
    static contextType = AppContext

    constructor(props) {
        super(props);
        this.state = {loading: true, routines: [], planificationId:null}
    }

    async componentDidMount() {
        try {
            const {state: {planificationId}} = this.context
            const res = await listRoutines(planificationId);
            this.setState({loading: false, routines: res.data, planificationId})
        } catch (e) {
            console.error(e)
        }
    }

    redirectToRoutine(id) {
        const {planificationId} = this.state;
        this.context.dispatch(setData({routineId: id}))
        this.props.history.push('/routine')
    }

    redirectToCreateRoutine() {
        const {planificationId, routines} = this.state;
        this.context.dispatch(setData({routineId: null, routineNumber: routines.length+1}))
        this.props.history.push('/routine/create')
    }

    render() {
        const {routines} = this.state;
        const {loading} = this.state;

        if (loading) {
            return <Loader active/>
        }

        return (
            <>
                <MenuBar/>
                <Segment basic style={{paddingTop: 20}}>
                    {
                        !routines.length &&
                        <Message>
                            <Message.Header>Sin Rutinas</Message.Header>
                            <p>Comienza agregando una rutina a tu planificacion. Usualmente una rutina es un dia de la semana.</p>
                        </Message>
                    }
                    {routines.map(p => (<Segment style={{width: '100%'}} key={p.id} onClick={() => this.redirectToRoutine(p.id)}>{p.name+' '+p.id}</Segment>))}
                    <Button.Group fluid>
                        <Button secondary onClick={() => this.props.history.push('/professor')}>Planificaciones</Button>
                        <Button primary onClick={() => this.redirectToCreateRoutine()}>Agregar una Rutina</Button>
                    </Button.Group>
                </Segment>
            </>
        )
    }
}

export default withRouter(PagePlanificationDetail);