import React, {Component} from "react";
import {Accordion, Button, Header, Icon, List, Loader, Segment, Table} from "semantic-ui-react";
import {withRouter} from "react-router-dom";
import {getRoutineDetails, shareRoutine} from "../service";
import {AppContext, setData} from "../context";
import BottomMenuBar from "./BottomMenuBar";
import LayoutMobile from "./LayoutMobile";

class PageRoutineDetail extends Component{
    static contextType = AppContext

    constructor(props) {
        super(props);
        this.state = {loading: true, name: '', blocks: [], planificationId: null, routineId: null, activeIndexes:[]}
    }

    async componentDidMount() {
        try {
            //todo: if I share a routine, the flow would start here.
            // given a token I should be able to retrieve the routine details to show and execute.
            // if the user is not logged in, does not have acces to any other part of the app and is
            // redirected to the login / sign up page.
            // put using a valid token can stay here for let's say one or two days.
            // this is an anonimous way of accessing the routine
            const {state: {routineId, planificationId}} = this.context
            const res = await getRoutineDetails(routineId);
            this.context.dispatch(setData({routineDetails: {...res.data, nextBlockNumber: res.data.blocks.length+1}}))
            this.setState({loading: false, planificationId, routineId, blocks: res.data.blocks, name: res.data.name, nextBlockNumber: res.data.blocks.length+1})
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
            //todo: how the fuck set the domain here?
            await navigator.clipboard.writeText(`localhost:3000${res.data}`);
        } catch (e) {
            console.error(e)
        }
    }

    renderRoutineDetails() {
        const {name, blocks, activeIndexes} = this.state;
        return (
            <LayoutMobile>
                <Header as={'h3'}>
                    {name}
                    <Icon name={'share square outline'} className={'header-icon'} onClick={() => this.shareRoutine()}/>
                </Header>
                <Accordion
                    style={{marginBottom: '1em'}}
                    exclusive={false}
                    fluid>
                    {blocks.map((b,i) => (<Segment style={{width: '100%'}} key={b.id}>
                        <Accordion.Title
                            style={{padding: 0}}
                            active={activeIndexes.indexOf(i) !== -1}
                            index={i}
                            onClick={this.handleActiveBlocks}>
                            {b.name}
                        </Accordion.Title>
                        <Accordion.Content active={activeIndexes.indexOf(i) !== -1}>
                            {b.duration && <div><b>Duracion: </b>{b.duration} minutos</div>}
                            {b.laps && <div><b>Rondas: </b>{b.laps}</div>}
                            {b.laprestinterval && <div><b>Descanso entre rondas: </b>{b.laprestinterval} segs</div>}
                            {b.exerestinterval && <div><b>Descanso entre ejercicios: </b>{b.exerestinterval} segs</div>}
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
                                            <Table.Cell>{e.name}</Table.Cell>
                                            {(e.reps || e.secs) && <Table.Cell>{e.reps ? e.reps+' Reps' : e.secs+' Segs'}</Table.Cell>}
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Accordion.Content>
                    </Segment>))}
                </Accordion>
                <Button primary fluid onClick={() => this.redirectToRoutineExecution()}>Ejecutar Rutina</Button>
                <Button.Group fluid style={{marginBottom: 50}}>
                    <Button secondary onClick={() => this.redirectToPlanification()}>Rutinas</Button>
                    <Button primary onClick={() => this.redirectToCreateBlock()}>Agregar un Bloque</Button>
                </Button.Group>
            </LayoutMobile>
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