import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import {Accordion, Button, Divider, Grid, Header, Icon, Input, Label, Message, Segment, Table} from "semantic-ui-react";
import {PopUpConfirmation} from "./PopUpConfirmation";
import {PopUpDisabledAction} from "./PopUpDisabledAction";
import {Chip} from "./Chip";
import {capitalize} from "../functions";

class PageWorkout extends Component {
    async componentDidMount() {
        // try {
        //     const res = await
        // } catch (e) {
        //     console.error(e)
        // }
    }

    renderWorkoutGroup(bg, b, j, i, editionMode, activeIndexes, confirmWorkDeletionIndex, addExerciseInputIndex, activeDraftExercise, confirmWorkExerciseDeletionIndex) {
        //todo: fix separate type from workout name.
        const name = b.name.split(' - ')
        return (
            <Segment style={{width: '100%'}} className={'no-left-padding no-right-padding'} key={b.id}>
                <Accordion.Title
                    className={'no-top-padding no-bottom-padding padding-left-1 padding-right-1'}
                    active={activeIndexes.indexOf(j+'-'+i) !== -1}
                    index={j+'-'+i}
                    onClick={!editionMode? this.handleActiveBlocks : () => {}}>
                    Trabajo {i+1} {name[1] ? <Chip feel content={capitalize(name[1])}/> : null}
                    {
                        editionMode &&
                        <PopUpConfirmation
                            title={'Borrar '+name[0]+'?'}
                            primary={'Borrar'}
                            secondary={'Cancelar'}
                            isManaged
                            open={(j+'-'+i)===confirmWorkDeletionIndex}
                            trigger={<Button
                                onClick={() => this.setState({confirmWorkDeletionIndex: j+'-'+i})}
                                basic secondary icon='close' style={
                                {position: 'relative', float: 'right', padding: 0, fontSize: 13}
                            }/>}
                            onPrimaryAction={() => this.deleteWorkFromBlockGroup(bg.id, b.id, j, i)}
                            onSecondaryAction={() => this.setState({confirmWorkDeletionIndex: null})}
                        />
                    }
                </Accordion.Title>
                <Accordion.Content active={activeIndexes.indexOf(j+'-'+i) !== -1}>
                    <Segment basic className={'no-top-padding no-bottom-padding no-margin'}>
                        {b.duration && <div><b>{b.duration} minutos</b> de duracion</div>}
                        {b.laps && <div className={'margin-bottom-1'}><b>{b.laps}</b> rondas</div>}
                        {
                            (b.laprestinterval || b.exerestinterval) &&
                            <>
                                Descanso
                                {b.exerestinterval &&
                                    <div>
                                        <b>{b.exerestinterval} segs</b> por ejercicio
                                    </div>}
                                {b.laprestinterval &&
                                    <div>
                                        <b>{b.laprestinterval} segs</b> por ronda
                                    </div>}
                            </>
                        }
                    </Segment>
                    <Table basic unstackable style={{border: 'unset'}}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Ejercicio</Table.HeaderCell>
                                {b.exercises.find(e => e.reps || e.secs) && <Table.HeaderCell>Trabajo</Table.HeaderCell>}
                                {editionMode && <Table.HeaderCell/>}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                b.exercises.length === 0 &&
                                <>
                                    <Table.Row style={{position: 'relative'}}>
                                        <Table.Cell>
                                            Sin Ejercicios
                                            {editionMode && this.renderAddExercise(bg, b, addExerciseInputIndex, j,i,0)}
                                        </Table.Cell>
                                    </Table.Row>
                                    {this.renderAddExerciseInputs(bg, b, addExerciseInputIndex, j,i,0, activeDraftExercise)}
                                </>
                            }
                            {b.exercises.map((e, k) => (this.renderExercise(
                                bg, b, e, j, i, k, editionMode, addExerciseInputIndex, activeDraftExercise, confirmWorkExerciseDeletionIndex
                            )))}
                        </Table.Body>
                    </Table>
                </Accordion.Content>
            </Segment>
        )
    }

    renderExercise(bg, b, e, j, i, k, editionMode, addExerciseInputIndex, activeDraftExercise, confirmWorkExerciseDeletionIndex) {
        const hasValue = e.reps || e.secs
        return (
            <>
                <Table.Row key={k} className={'table-row-item'}>
                    <Table.Cell style={{position: 'relative'}} colSpan={editionMode ? '3' : null}>
                        <Grid>
                            <Grid.Column width={editionMode ? !hasValue ? 13 : 8 : 16}>
                                {e.isDraft && <div className={'label-new-item'}/>}
                                {e.videoCode ? <Link to={'#'} onClick={() => this.openExerciseVideo(e.videoCode)}>{e.name}</Link> : e.name}
                            </Grid.Column>
                            {
                                editionMode &&
                                <Grid.Column width={!hasValue ? 3 : 8}>
                                    {
                                        e.toDelete &&
                                        <>
                                            <Label color='red' style={{float: 'right'}}>
                                                A borrar
                                            </Label>
                                        </>
                                    }
                                    {
                                        !e.toDelete &&
                                        <>
                                            {hasValue && (e.reps ? e.reps+' Reps' : e.secs+' Segs')}
                                            <PopUpConfirmation
                                                title={'Borrar '+e.name+'?'}
                                                primary={'Borrar'}
                                                secondary={'Cancelar'}
                                                isManaged
                                                open={(j+'-'+i+'-'+k)===confirmWorkExerciseDeletionIndex}
                                                trigger={<Button
                                                    onClick={() => this.setState({confirmWorkExerciseDeletionIndex: j+'-'+i+'-'+k})}
                                                    className={'table-remove-item'} icon='close'/>}
                                                onPrimaryAction={() => this.deleteExerciseFromWork(bg.id, b.id, e.id, j, i, k, e.isDraft)}
                                                onSecondaryAction={() => this.setState({confirmWorkExerciseDeletionIndex: null})}
                                            />
                                        </>
                                    }
                                </Grid.Column>
                            }
                        </Grid>
                        {editionMode && this.renderAddExercise(bg, b, addExerciseInputIndex, j,i,k)}
                    </Table.Cell>
                    {
                        (e.reps || e.secs) && !editionMode &&
                        <Table.Cell>
                            {e.reps ? e.reps+' Reps' : e.secs+' Segs'}
                        </Table.Cell>
                    }
                </Table.Row>
                {this.renderAddExerciseInputs(bg, b, addExerciseInputIndex, j,i,k, activeDraftExercise)}
            </>
        )
    }

    render() {
        const {blockGroupers} = this.state
        return (
            <Accordion
                style={{marginBottom: '1em'}}
                exclusive={false}
                fluid>
                {blockGroupers.map((bg,j) => (
                    <Segment key={j} className={'padding-left-half padding-right-half'}>
                        <Header className={'align-center'} as={'h5'}>
                            {!editionMode && <span>{bg.name}</span>}
                            {
                                editionMode &&
                                <>
                                    <Input
                                        className={'input-header input-centered'}
                                        placeholder={bg.name}
                                        value={bg.name}
                                        onChange={(e, {value}) => this.onGrouperNameChange(bg.id, j, value)}/>
                                    <PopUpConfirmation
                                        title={'Borrar '+bg.name+'?'}
                                        primary={'Borrar'}
                                        secondary={'Cancelar'}
                                        isManaged
                                        open={j===confirmBlockGroupDeletionIndex}
                                        trigger={<Button
                                            onClick={() => this.setState({confirmBlockGroupDeletionIndex: j})}
                                            basic secondary icon='close' style={
                                            {position: 'relative', float: 'right', padding: 0, fontSize: 13}
                                        }/>}
                                        onPrimaryAction={() => this.deleteBlockGroup(bg.id, j)}
                                        onSecondaryAction={() => this.setState({confirmBlockGroupDeletionIndex: null})}
                                    />
                                </>
                            }
                        </Header>
                        <div>
                            {
                                bg.blocks.length === 0 &&
                                <Message><Message.Content>Comienza agregando algunos trabajos al bloque</Message.Content></Message>
                            }
                            {bg.blocks.map((b,i) => (this.renderWorkoutGroup(
                                bg, b, j, i, editionMode, activeIndexes, confirmWorkDeletionIndex, addExerciseInputIndex, activeDraftExercise, confirmWorkExerciseDeletionIndex
                            )))}
                        </div>
                        <Divider horizontal>
                            {
                                (!editionMode && actionable) ?
                                    !editRoutine ?
                                        <PopUpDisabledAction
                                            trigger={<Icon name={'plus'} className={'disabled-btn'}/>}/>
                                        :
                                        canEdit ?
                                            <Icon name={'plus'} onClick={() => this.addWorkToGrouper(bg, j)}/> :
                                            <PopUpDisabledAction
                                                disableHeader={'No es posible agregar'}
                                                disableDescription={'Tu o un atleta ya marcaron esta rutina como completada u omitida'}
                                                trigger={<Icon name={'plus'} className={'disabled-btn'}/>}/> : null
                            }
                        </Divider>
                    </Segment>
                ))}
            </Accordion>
        )
    }
}

export default withRouter(PageWorkout);