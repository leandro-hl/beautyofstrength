import React, {Component, createRef} from "react";
import {Button, Divider, Dropdown, Input, Label, List, Loader, Segment} from "semantic-ui-react";
import {ExerciseListItem} from "./ExerciseListItem";
import {listExercises, saveExercisesBlock, signIn} from "../service"
import {RestInput} from "./RestInput";
import {withRouter} from "react-router-dom";
import PagePlanificationList from "./PagePlanificationList";

class HomeProfessor extends Component {
    state = {loading: true, planifications: []}

    async componentDidMount() {
        try {
            await signIn('juan123');
        } catch (e) {
            console.error(e)
        } finally {
            this.setState({loading: false})
        }
    }

    render() {
        const {loading} = this.state;

        if (loading) {
            return <Loader active/>
        }

        return (<PagePlanificationList/>)
    }
}

export default withRouter(HomeProfessor);