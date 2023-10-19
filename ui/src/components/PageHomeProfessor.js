import React, {Component, createRef} from "react";
import {Button, Divider, Dropdown, Input, Label, List, Loader, Menu, Segment} from "semantic-ui-react";
import {ExerciseListItem} from "./ExerciseListItem";
import {listExercises, saveExercisesBlock, signIn} from "../service"
import {RestInput} from "./RestInput";
import {withRouter} from "react-router-dom";
import PagePlanificationList from "./PagePlanificationList";
import BottomMenuBar from "./BottomMenuBar";
import LayoutMobile from "./LayoutMobile";
import {AppContext, setData} from "../context";

class PageHomeProfessor extends Component {
    static contextType = AppContext
    state = {loading: true, planifications: []}

    async componentDidMount() {
        try {
            this.context.dispatch(setData({noBottomBar: false}))
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
                HOME MOSTRAR HJOME
            </>
        )
    }
}

export default withRouter(PageHomeProfessor);