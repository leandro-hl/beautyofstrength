import React, {Component, createRef} from "react";
import {Button, Divider, Dropdown, Header, Input, Label, List, Loader, Menu, Segment} from "semantic-ui-react";
import {ExerciseListItem} from "./ExerciseListItem";
import {listExercises, saveExercisesBlock, signIn} from "../service"
import {RestInput} from "./RestInput";
import {withRouter} from "react-router-dom";
import PagePlanificationList from "./PagePlanificationList";
import BottomMenuBar from "./BottomMenuBar";
import LayoutMobile from "./LayoutMobile";
import {AppContext, setData} from "../context";
import {MENU} from "../enums";

class PageHomeProfessor extends Component {
    static contextType = AppContext
    state = {loading: true, planifications: []}

    async componentDidMount() {
        try {
            this.context.dispatch(setData({noBottomBar: false, menuButtonSelected: MENU.HOME}))
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

        return (
            <>
                <Header as={'h3'}>Proximamente</Header>
                <Segment>Proximamente la nueva home disponible</Segment>
            </>
        )
    }
}

export default withRouter(PageHomeProfessor);