import React, {Component, createRef} from "react";
import {Button, Divider, Dropdown, Header, Input, Label, List, Loader, Menu, Message, Segment} from "semantic-ui-react";
import {ExerciseListItem} from "./ExerciseListItem";
import {listExercises, listLatestEvents, saveExercisesBlock, signIn} from "../service"
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
            const res = await listLatestEvents()
            this.context.dispatch(setData({noBottomBar: false, menuButtonSelected: MENU.HOME}))
            this.setState({events: res.data.events})
        } catch (e) {
            console.error(e)
        } finally {
            this.setState({loading: false})
        }
    }

    render() {
        const {loading, events} = this.state;

        if (loading) {
            return <Loader active/>
        }

        return (
            <>
                <Header as={'h3'}>Inicio</Header>
                {events.length === 0 && <Message><Message.Content>No hay eventos que mostrar</Message.Content></Message>}
                {events.map((e,i) => (<Segment key={i}>{e}</Segment>))}
            </>
        )
    }
}

export default withRouter(PageHomeProfessor);