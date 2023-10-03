import React, {Component, createRef} from "react";
import {Button, Divider, Dropdown, Input, Label, List, Segment} from "semantic-ui-react";
import {ExerciseListItem} from "./ExerciseListItem";
import {listExercises, saveExercisesBlock} from "../service"
import {RestInput} from "./RestInput";
import {withRouter} from "react-router-dom";

class HomeProfessor extends Component {
    dropdownRef = createRef()
    state = {add:true, exercises: [], exerciseOptions: [], lapRestDefault: 'min', exeRestDefault: 'seg'}

    async componentDidMount() {
        try {
            this.setState({loading: true})
            const res = await listExercises()

            this.setState({loading: false, exerciseOptions: res.data.map(e => ({key: e.id, value:e.id, text:e.name}))})
        } catch (e) {

        }
    }

    saveExercise(i, reps) {
        const {exercises} = this.state
        const index = exercises.indexOf(i)
        exercises[index].reps = reps

        this.setState({exercises})
        if (this.dropdownRef.current) {
            const inputElement = this.dropdownRef.current.querySelector('input');
            if (inputElement) {
                inputElement.focus();
            }
        }
    }



    handleChange = (e, input) => {
        const {exercises, exerciseOptions} = this.state;

        const exercise = input.options.filter(o => o.value === input.value)[0]
        exercises.push(exercise)

        const i = exerciseOptions.indexOf(exercise)
        exerciseOptions.splice(i, 1)
        this.setState({exercises, exerciseOptions})
    }

    restUpdate(type, obj) {
        this.setState({[type]: {...this.state[type], ...obj}})
    }

    async saveExercisesBlock() {
        try {
            const {exercises, laps, lapRest, exeRest, lapRestDefault, exeRestDefault} = this.state
            this.setState({saving: true})

            if(!lapRest.interval) {
                lapRest.interval = lapRestDefault
            }
            if(!exeRest.interval) {
                exeRest.interval = exeRestDefault
            }
            lapRest.amount = parseFloat(lapRest.amount)
            exeRest.amount = parseFloat(exeRest.amount)

            const request = {
                exercises: exercises.map(e => ({id:e.key, reps: parseInt(e.reps, 10)})),
                laps: parseInt(laps, 10),
                lapRest,
                exeRest
            }
            const res = await saveExercisesBlock(request)

            this.setState({saving: false})
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        /*
            2. FLOW PROFESOR BETA V0.1
                1. Carga de un bloque de entrenamiento con los siguientes datos
                1. cantidad de vueltas
                2. tiempo de descanso entre vueltas (minutos o segundos)
                3. Tiempo de descanso entre ejercicios
                4. El bloque posee una lista de ejercicios + cantidad de repeticiones
                GUARDAR DATA EN DB
         */
        const {add, exercises, exerciseOptions, lapRestDefault, exeRestDefault} = this.state;

        return (
            <Segment basic>
                <Button fluid onClick={() => this.setState({add: true})}>Agregar Bloque</Button>
                {
                    add &&
                    <>
                        <List>
                            {
                                exercises.map(i => {
                                    return (<ExerciseListItem key={i.id} item={i} finished={(reps) => this.saveExercise(i, reps)}/>)
                                })
                            }
                        </List>
                        <div ref={this.dropdownRef}>
                            <Dropdown
                                placeholder='Elegir Ejercicio'
                                fluid
                                search
                                selection
                                options={exerciseOptions}
                                onChange={this.handleChange}
                                openOnFocus={true}
                                tabIndex={0}
                                noResultsMessage={'No se encontro el ejercicio'}
                                selectOnBlur={false}
                            />
                        </div>
                        <Divider hidden/>
                        <RestInput default={lapRestDefault} type={'lapRest'} onChange={(type, obj) => this.restUpdate(type, obj)}/>
                        <RestInput default={exeRestDefault} type={'exeRest'} onChange={(type, obj) => this.restUpdate(type, obj)}/>
                        <Input type='number' className={'align-center'} fluid placeholder='4' max={9} min={0} action onChange={(e, {value}) => this.setState({laps: value})}>
                            <Label>Rondas</Label>
                            <input/>
                        </Input>
                        <Button.Group fluid>
                            <Button secondary onClick={() => this.props.history.push('/')}>Cancelar</Button>
                            <Button primary onClick={() => this.saveExercisesBlock()}>Guardar</Button>
                        </Button.Group>
                    </>
                }
            </Segment>
        )
    }
}

export default withRouter(HomeProfessor);