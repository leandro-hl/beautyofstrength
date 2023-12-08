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

const MenuHeaderRender = () => {
    return <>Inicio</>
}

class PageHomeProfessor extends Component {
    static contextType = AppContext
    state = {loading: true}

    async componentDidMount() {
        try {
            this.context.dispatch(setData({
                noBottomBar: false,
                menuButtonSelected: MENU.HOME,
                MenuHeaderRender: <MenuHeaderRender/>
            }))
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
            <></>
        )
    }
}

export default withRouter(PageHomeProfessor);