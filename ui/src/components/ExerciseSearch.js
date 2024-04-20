import React, {Component} from "react";
import {Dropdown, Grid, Loader} from "semantic-ui-react";
import {capitalize} from "../functions";
import {createNewExercise, listExercises} from "../service";
import {Chip} from "./Chip";
import {AppContext, setData} from "../context";
import {ModalExerciseCreate} from "./ModalExerciseCreate";

export class ExerciseSearch extends Component {
    static contextType = AppContext

    constructor(props) {
        super(props);

        this.state = {
            alwaysClear: props.alwaysClear,
            basic: props.basic,
            allowAdditions: props.allowAdditions,
            exercisesBuffer: props.defaultSelected ?? [],
            exerciseOptions: [],
            loading: true
        }
    }

    async componentDidMount() {
        await this.calculateExercises()
    }

    async calculateExercises() {
        try {
            const {basic} = this.state
            const {state: {prepareExercises}} = this.context

            let res = {}
            if (prepareExercises.data.exercises.length === 0) {
                res = await listExercises()
            } else {
                res = prepareExercises
            }

            let biggerId = 0
            for (let i = 0; i < res.data.exercises.length; i++) {
                if (res.data.exercises[i].id > biggerId) {
                    biggerId = res.data.exercises[i].id
                }
            }

            const options = res.data.exercises.map(e => ({
                key: e.id,
                value:e.id,
                text: e.name,
                content: (
                    res.data.showVideoInfo && !basic ?
                        <Grid>
                            <Grid.Row>
                                {
                                    e.nocurrentuservideo ?
                                        <>
                                            <Grid.Column width={11}>
                                                {e.name}
                                            </Grid.Column>
                                            <Grid.Column width={5} className={'no-padding'}>
                                                <Chip omit content={'Sin video'}/>
                                            </Grid.Column>
                                        </> : <Grid.Column>
                                            {e.name}
                                        </Grid.Column>
                                }
                            </Grid.Row>
                        </Grid> : e.name
                ),
                // createdbyuser: e.createdbyuser.toLowerCase(),
                keyWords: e.name.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' '),
                comparer: e.name.toLowerCase().trim().replaceAll(' ', '')
            }))

            this.setState({
                biggerId,
                showVideoInfo: res.data.showVideoInfo,
                exerciseOptions: options,
                loading: false
            })

            this.context.dispatch(setData({prepareExercises: {data: res.data}}))
        } catch (e) {
            console.error(e)
        }
    }

    sanitizeExerciseKey(newExerciseName) {
        return newExerciseName.replace(this.getRegex(), "");
    }

    getRegex() {
        return /[^a-zA-Z0-9áéíóúüÁÉÍÓÚÜÑñ/]/g
    }

    async createNewExercise(name, selectedEquipment) {
        try {
            const {state: {prepareExercises}} = this.context
            const {exerciseOptions, exercisesBuffer} = this.state
            this.setState({creating: true})

            //make sure this does not already exist
            const newExerciseName = name
            const sanitizedInput = this.sanitizeExerciseKey(newExerciseName)
            const ex = exerciseOptions.find(e => e.comparer === sanitizedInput)

            if (!ex) {
                //sanitize whole input
                const regex = this.getRegex()
                const words = newExerciseName.split(' ')
                for (let i = 0; i < words.length; i++) {
                    const sanitizedWord = words[i].replace(regex, "");
                    words[i] = capitalize(sanitizedWord)
                }

                const name = words.join(' ')
                const res = await createNewExercise({name, equipment: selectedEquipment.map(s => ({id: s.id, occurrences: s.occurrences}))})

                //adding exercise to current cached data
                const exercise = {text: name, keyWords: name.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' '), key: res.data.id, value: res.data.id, name:name, id:res.data.id}
                exerciseOptions.push({...exercise, comparer: sanitizedInput})
                exercisesBuffer.push(exercise)
                this.setState({exerciseOptions, exercisesBuffer})
                this.props.onSelected(exercisesBuffer.map(e => ({...e})))
                prepareExercises.data.exercises.push(exercise)
                this.context.dispatch(setData({prepareExercises: prepareExercises}))
            } else {
                exercisesBuffer.push(ex)
                this.setState({exercisesBuffer})
            }
        } catch (e) {
            console.error(e)
        } finally {
            this.setState({openNewExerciseModal: false, newExerciseName: null, creating: false})
        }
    }

    handleExerciseSelection = (e, input) => {
        if (typeof(input.value[input.value.length-1]) === 'string') {
            return
        }
        const {basic, alwaysClear} = this.state
        const value = basic ?  [input.value] : input.value
        const exercises = value.map(v => (input.options.find(x => x.value === v)))
        if (!alwaysClear) {
            this.setState({exercisesBuffer: [...exercises]})
        }
        this.props.onSelected(exercises.map(e => ({...e})))
    }

    onAddItem(value) {
        const {exerciseOptions, exercisesBuffer} = this.state
        this.setState({creating: true})

        //make sure this does not already exist
        const sanitizedInput = this.sanitizeExerciseKey(value)
        const ex = exerciseOptions.find(e => e.comparer === sanitizedInput)

        if (!ex) {
            this.setState({openNewExerciseModal: true, newExerciseName: value})
        } else {
            exercisesBuffer.push(ex)
            this.setState({exercisesBuffer})
        }
    }

    searchByKeyWord(options, query) {
        const arraySearch = query.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(' ')

        const filterFunc = (opt) => {
            return arraySearch.filter(word => opt.keyWords.find(keyWord => keyWord.includes(word))).length===arraySearch.length
        }

        return options.filter(filterFunc)
    }

    render() {
        const {loading, allowAdditions, exerciseOptions, exercisesBuffer, basic, openNewExerciseModal, newExerciseName, searchQuery} = this.state

        if(loading) {
            return <Loader active/>
        }

        return (
            <>
                <Dropdown
                    placeholder={basic ? 'Ejercicio' : 'Elegi los ejercicios'}
                    fluid
                    multiple={!basic}
                    search={this.searchByKeyWord}
                    selection
                    onFocus={() => this.props.onFocus()}
                    onMouseDown={() => this.props.onFocus()}
                    onBlur={() => this.props.onBlur()}
                    allowAdditions={allowAdditions}
                    additionLabel='Agregar '
                    options={exerciseOptions}
                    onAddItem={(e, { value }) => this.onAddItem(value)}
                    value={basic ? exercisesBuffer.map(e => e.value)[exercisesBuffer.length-1] : exercisesBuffer.map(e => e.value)}
                    onChange={this.handleExerciseSelection}
                    openOnFocus={this.props.openOnFocus ?? true}
                    tabIndex={0}
                    noResultsMessage={'No se encontro el ejercicio'}
                    selectOnBlur={false}/>
                {openNewExerciseModal && <ModalExerciseCreate
                    handleConfirm={(name, selectedEquipment) => this.createNewExercise(name, selectedEquipment)}
                    handleClose={() => this.setState({openNewExerciseModal: false, newExerciseName: null})}
                    open={openNewExerciseModal}
                    name={newExerciseName}/>}
            </>
        )
    }
}