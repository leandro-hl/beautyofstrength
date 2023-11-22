import React, {Component} from "react";
import {Dropdown, Grid} from "semantic-ui-react";
import {capitalize} from "../functions";
import {listExercises} from "../service";
import {Chip} from "./Chip";
import {AppContext, setData} from "../context";

export class ExerciseSearch extends Component {
    static contextType = AppContext

    constructor(props) {
        super(props);

        this.state = {
            basic: props.basic,
            allowAdditions: props.allowAdditions,
            exercisesBuffer: props.defaultSelected ?? [],
            exerciseOptions: []
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
                this.context.dispatch(setData({prepareExercises: {data: res.data}}))
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
                comparer: e.name.toLowerCase().trim().replaceAll(' ', '')
            }))

            this.setState({
                biggerId,
                showVideoInfo: res.data.showVideoInfo,
                exerciseOptions: options
            })
        } catch (e) {
            console.error(e)
        }
    }

    onAddUnexistingExercise(value) {
        const {exercisesBuffer, exerciseOptions, biggerId} = this.state;
        const {state: {prepareExercises}} = this.context

        const regex = /[^a-zA-Z0-9áéíóúüÁÉÍÓÚÜÑñ/]/g
        const sanitizedInput = value.replace(regex, "");
        const ex = exerciseOptions.find(e => e.comparer === sanitizedInput)

        if (!!ex) {
            exercisesBuffer.push(ex)
            this.setState({exercisesBuffer})
        } else {
            const words = value.split(' ')
            for (let i = 0; i < words.length; i++) {
                const sanitizedWord = words[i].replace(regex, "");
                words[i] = capitalize(sanitizedWord)
            }

            const name = words.join(' ')
            const lastBiggerId = biggerId+1
            const exercise = {text: name, key: lastBiggerId, value: lastBiggerId, draft: true, name:name, id:lastBiggerId}
            exerciseOptions.push(exercise)
            exercisesBuffer.push(exercise)
            this.setState({exerciseOptions, exercisesBuffer, biggerId: lastBiggerId})
            this.props.onSelected(exercisesBuffer.map(e => ({...e})))
            prepareExercises.data.exercises.push(exercise)
            this.context.dispatch(setData({prepareExercises: prepareExercises}))
        }
    }

    handleExerciseSelection = (e, input) => {
        if (typeof(input.value[input.value.length-1]) === 'string') {
            return
        }
        const {basic} = this.state
        const value = basic ?  [input.value] : input.value
        const exercises = value.map(v => (input.options.find(x => x.value === v)))
        this.setState({exercisesBuffer: [...exercises]})
        this.props.onSelected(exercises.map(e => ({...e})))
    }

    render() {
        const {allowAdditions, exerciseOptions, exercisesBuffer, basic} = this.state
        return (
            <Dropdown
                placeholder={basic ? 'Ejercicio' : 'Elegi los ejercicios'}
                fluid
                multiple={!basic}
                search
                selection
                allowAdditions={allowAdditions}
                additionLabel='Agregar '
                onAddItem={(e, { value }) => this.onAddUnexistingExercise(value)}
                options={exerciseOptions}
                value={basic ? exercisesBuffer.map(e => e.value)[0] : exercisesBuffer.map(e => e.value)}
                onChange={this.handleExerciseSelection}
                openOnFocus={true}
                tabIndex={0}
                noResultsMessage={'No se encontro el ejercicio'}
                selectOnBlur={false}
            />
        )
    }
}