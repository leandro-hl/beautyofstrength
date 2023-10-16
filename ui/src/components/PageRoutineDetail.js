import React, {Component} from "react";
import {Accordion, Button, Header, List, Loader, Segment, Table} from "semantic-ui-react";
import {withRouter} from "react-router-dom";
import {queryParam} from "../functions";
import {getRoutineDetails} from "../service";
import PageRoutineExecution from "./PageRoutineExecution";
import {AppContext, setData} from "../context";

class PageRoutineDetail extends Component{
    static contextType = AppContext

    constructor(props) {
        super(props);
        this.state = {loading: true, name: '', blocks: [], planificationId: null, routineId: null, activeIndexes:[]}
    }

    async componentDidMount() {
        try {
            const {state: {routineId, planificationId}} = this.context
            const res = await getRoutineDetails(routineId);
            this.context.dispatch(setData({routineDetails: {...res.data, nextBlockNumber: res.data.blocks.length+1}}))
            this.setState({loading: false, planificationId, routineId, blocks: res.data.blocks, name: res.data.name, nextBlockNumber: res.data.blocks.length+1})
        } catch (e) {
            console.error(e)
        }
    }

    redirectToCreateBlock() {
        const {planificationId, routineId, nextBlockNumber} = this.state;
        this.props.history.push('/block/create')
    }

    redirectToPlanification() {
        const {planificationId} = this.state;
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

    renderRoutineDetails() {
        const {name, blocks, activeIndexes} = this.state;
        return (
            <Segment basic style={{height: '100%'}}>
                <Header as={'h3'}>{name}</Header>
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
            </Segment>
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