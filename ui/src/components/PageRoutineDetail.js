import React, {Component} from "react";
import {Accordion, Button, Header, List, Loader, Segment, Table} from "semantic-ui-react";
import {withRouter} from "react-router-dom";
import {queryParam} from "../functions";
import {getRoutineDetails} from "../service";

class PageRoutineDetail extends Component{
    constructor(props) {
        super(props);
        const planificationId = queryParam(props, 'planificationId')
        const routineId = queryParam(props, 'routineId')
        this.state = {loading: true, name: '', blocks: [], planificationId, routineId, activeIndexes:[]}
    }

    async componentDidMount() {
        try {
            const {routineId} = this.state
            const res = await getRoutineDetails(routineId);
            this.setState({loading: false, blocks: res.data.blocks, name: res.data.name, nextBlockNumber: res.data.blocks.length+1})
        } catch (e) {
            console.error(e)
        }
    }

    redirectToCreateBlock() {
        const {planificationId, routineId, nextBlockNumber} = this.state;
        this.props.history.push('/block/create?planificationId='+planificationId+'&routineId='+routineId+'&nextBlockNumber='+nextBlockNumber)
    }

    redirectToPlanification() {
        const {planificationId} = this.state;
        this.props.history.push('/planification?id='+planificationId)
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndexes } = this.state

        //si ya esta dentro de los activos, lo saca, sino lo agrega.
        const indexOfIndex = activeIndexes.indexOf(index)
        if (indexOfIndex !== -1) {
            activeIndexes.splice(indexOfIndex, 1)
        } else {
            activeIndexes.push(index)
        }

        this.setState({ activeIndexes: activeIndexes })
    }

    render() {
        const {name, blocks, activeIndexes} = this.state;
        const {loading} = this.state;

        if (loading) {
            return <Loader active/>
        }

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
                            onClick={this.handleClick}>
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
                <Button.Group fluid style={{marginBottom: 50}}>
                    <Button secondary onClick={() => this.redirectToPlanification()}>Rutinas</Button>
                    <Button primary onClick={() => this.redirectToCreateBlock()}>Agregar un Bloque</Button>
                </Button.Group>
            </Segment>
        )
    }
}

export default withRouter(PageRoutineDetail);