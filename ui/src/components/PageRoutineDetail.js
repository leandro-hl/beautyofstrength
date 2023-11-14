import React, {Component} from "react";
import {Accordion, Button, Divider, Header, Icon, List, Loader, Popup, Segment, Table} from "semantic-ui-react";
import {Link, withRouter} from "react-router-dom";
import {getRoutineDetails, getSharedRoutineDetails, shareRoutine} from "../service";
import {AppContext, setData} from "../context";
import BottomMenuBar from "./BottomMenuBar";
import LayoutMobile from "./LayoutMobile";
import {capitalize, isLocalhost, queryParam} from "../functions";
import {MENU} from "../enums";
import {PopUpDisabledAction} from "./PopUpDisabledAction";
import {ModalBlockCreate} from "./ModalBlockCreate";
import {Chip} from "./Chip";

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
                this.context.dispatch(setData({
                    secondaryActions: [],
                    noBottomBar: false,
                    menuButtonSelected: MENU.PLANIFICATIONS,
                    routineDetails: {...res.data, nextBlockNumber: res.data.blockGroupers.length+1}}))
                this.setState({
                    loading: false,
                    isShared: true,
                    routineId: res.data.id,
                    blockGroupers: res.data.blockGroupers,
                    name: res.data.name,
                    nextBlockNumber: res.data.blockGroupers.length+1})
            } else {
                const {state: {routineId, planificationId, isOwner, permissions: {createManyExerciseBlocks}}} = this.context
                const res = await getRoutineDetails(routineId);

                const secondaryActions = []
                if (isOwner && !res.data.alreadyMarkedByAthetles) {
                    secondaryActions.push({disabled: !createManyExerciseBlocks, func: () => this.addBlock(), description: 'Agregar Bloque'})
                }

                this.context.dispatch(setData({
                    secondaryActions: secondaryActions,
                    noBottomBar: false,
                    menuButtonSelected: MENU.PLANIFICATIONS,
                    routineDetails: {...res.data, nextBlockNumber: res.data.blockGroupers.length+1}
                }))
                this.setState({
                    loading: false,
                    planificationId,
                    isOwner,
                    routineId,
                    blockGroupers: res.data.blockGroupers,
                    name: res.data.name,
                    nextBlockNumber: res.data.blockGroupers.length+1})
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
                await navigator.clipboard.writeText(`localhost:3000/app${res.data}`);
            } else {
                await navigator.clipboard.writeText(`https://bos.team/app${res.data}`);
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

    openExerciseVideo(videoCode) {
        this.context.dispatch(setData({videoCode: videoCode}))
    }

    addWorkToGrouper(bg, i) {
        try {
            this.context.dispatch(setData({nextWorkNumber: bg.blocks.length+1,newBlockGroupName: bg.name, newBlockGroupId: bg.id}, true))
            this.redirectToCreateBlock()
        } catch (e) {
            console.error(e)
        }
    }

    addBlock() {
        this.setState({ showCreateBlockModal: true });
    }

    addNewBlockGroupConfirm() {
        try {
            const {newBlockName} = this.state
            this.context.dispatch(setData({nextWorkNumber: 1, newBlockGroupName: newBlockName, newBlockGroupId: null}, true))
            this.redirectToCreateBlock()
        } catch (e) {
            console.error(e)
        }
        this.addNewBlockGroupClose();
    }

    addNewBlockGroupClose = () => {
        this.setState({ showCreateBlockModal: false });
    }

    renderRoutineDetails() {
        const {state: {permissions: {executeRoutine}}} = this.context
        const {name, blockGroupers, activeIndexes, isShared, showPopUp, isOwner, showCreateBlockModal} = this.state;
        return (
            <>
                <Header as={'h3'}>
                    <Button className={'header-back-arrow'} icon onClick={() => isShared? this.redirectToPlanifications() : this.redirectToPlanification()}>
                        <Icon name={'arrow left'}/>
                    </Button>
                    {name}
                    {
                        (!isShared && isOwner) &&
                        <Popup size={'small'}
                               trigger={<Icon name={'share square outline'} className={'header-icon'} onClick={() => this.shareRoutine()}/>}
                               position={'bottom right'}
                               open={showPopUp} content="Link copiado al portapapeles!" basic/>
                    }
                </Header>
                {/*{*/}
                {/*    (isOwner || executeRoutine || isShared) &&*/}
                {/*    <Button*/}
                {/*        style={{marginBottom: '1em'}}*/}
                {/*        primary fluid*/}
                {/*        onClick={() => this.redirectToRoutineExecution()}>*/}
                {/*        Ejecutar Rutina*/}
                {/*    </Button>*/}
                {/*}*/}
                {
                    (!isOwner && !executeRoutine && !isShared) &&
                    <PopUpDisabledAction trigger={<Button className={'disabled-btn'} style={{marginBottom: '1em'}} primary fluid>
                        Ejecutar Rutina
                    </Button>}/>
                }
                <Accordion
                    style={{marginBottom: '1em'}}
                    exclusive={false}
                    fluid>
                    {blockGroupers.map((bg,j) => (
                        <Segment key={j}>
                            <Header className={'align-center'} as={'h5'}>{bg.name}</Header>
                            <div>
                                {bg.blocks.map((b,i) => {
                                    const name = b.name.split(' - ')
                                    return (
                                        <Segment style={{width: '100%'}} key={b.id}>
                                            <Accordion.Title
                                                style={{padding: 0}}
                                                active={activeIndexes.indexOf(j+'-'+i) !== -1}
                                                index={j+'-'+i}
                                                onClick={this.handleActiveBlocks}>
                                                {name[0]} {name[1] ? <Chip feel content={capitalize(name[1])}/> : null}
                                            </Accordion.Title>
                                            <Accordion.Content active={activeIndexes.indexOf(j+'-'+i) !== -1}>
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
                                                                <Table.Cell>
                                                                    {e.videoCode ? <Link to={'#'} onClick={() => this.openExerciseVideo(e.videoCode)}>{e.name}</Link> : e.name}
                                                                </Table.Cell>
                                                                {(e.reps || e.secs) && <Table.Cell>{e.reps ? e.reps+' Reps' : e.secs+' Segs'}</Table.Cell>}
                                                            </Table.Row>
                                                        ))}
                                                    </Table.Body>
                                                </Table>
                                            </Accordion.Content>
                                        </Segment>
                                    )
                                })}
                            </div>
                            <Divider horizontal><Icon name={'plus'} onClick={() => this.addWorkToGrouper(bg,j)}/></Divider>
                        </Segment>
                    ))}
                </Accordion>
                <ModalBlockCreate
                    open={showCreateBlockModal}
                    onChange={(name)=> this.setState({newBlockName: name})}
                    onClose={() => this.addNewBlockGroupClose()}
                    onConfirm={() => this.addNewBlockGroupConfirm()}/>
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