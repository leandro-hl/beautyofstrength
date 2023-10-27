import React, {Component} from "react";
import {Accordion, Button, Header, Icon, List, Loader, Popup, Segment, Table} from "semantic-ui-react";
import {withRouter} from "react-router-dom";
import {getRoutineDetails, getSharedRoutineDetails, shareRoutine} from "../service";
import {AppContext, setData} from "../context";
import BottomMenuBar from "./BottomMenuBar";
import LayoutMobile from "./LayoutMobile";
import {isLocalhost, queryParam} from "../functions";
import {MENU} from "../enums";

class PageRoutineDetail extends Component{
    static contextType = AppContext

    constructor(props) {
        super(props);
        this.state = {loading: true, name: '', blocks: [], planificationId: null, routineId: null, activeIndexes:[]}
    }

    async componentDidMount() {
        try {
            let share = localStorage.getItem('routine-shared')
            localStorage.removeItem('routine-shared')
            if (!share) {
                share = queryParam(this.props, 'share')
            }
            if (!!share) {
                const res = await getSharedRoutineDetails(share)
                this.context.dispatch(setData({noBottomBar: false, menuButtonSelected: MENU.PLANIFICATIONS, secondaryActions: [], routineDetails: {...res.data, nextBlockNumber: res.data.blocks.length+1}}))
                this.setState({loading: false, isShared: true, routineId: res.data.id, blocks: res.data.blocks, name: res.data.name, nextBlockNumber: res.data.blocks.length+1})
            } else {
                const {state: {routineId, planificationId, permissions: {createManyExerciseBlocks}}} = this.context
                const res = await getRoutineDetails(routineId);

                const secondaryActions = [
                    {disabled: !createManyExerciseBlocks, func: () => this.redirectToCreateBlock(), description: 'Agregar Bloque'}
                ]
                this.context.dispatch(setData({secondaryActions: secondaryActions, noBottomBar: false, menuButtonSelected: MENU.PLANIFICATIONS, routineDetails: {...res.data, nextBlockNumber: res.data.blocks.length+1}}))
                this.setState({loading: false, planificationId, routineId, blocks: res.data.blocks, name: res.data.name, nextBlockNumber: res.data.blocks.length+1})
            }
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

    redirectToPlanifications() {
        this.props.history.push('/my-planifications')
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

            if (isLocalhost()) {
                await navigator.clipboard.writeText(`localhost:3000${res.data}`);
            } else {
                await navigator.clipboard.writeText(`https://bos.team${res.data}`);
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

    renderRoutineDetails() {
        const {name, blocks, activeIndexes, isShared, showPopUp} = this.state;
        return (
            <>
                <Header as={'h3'}>
                    <Button className={'header-back-arrow'} icon onClick={() => this.redirectToPlanifications()}>
                        <Icon name={'arrow left'}/>
                    </Button>
                    {name}
                    {!isShared && <Popup size={'small'} trigger={<Icon name={'share square outline'} className={'header-icon'}
                                                        onClick={() => this.shareRoutine()}/>} position={'bottom right'} open={showPopUp} content="Link copiado al portapapeles!" basic/>}
                </Header>
                <Button style={{marginBottom: '1em'}} primary fluid onClick={() => this.redirectToRoutineExecution()}>Ejecutar Rutina</Button>
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
            </>
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