/**
 * Copyright 2025 Leandro Herenu - BOS (Beauty Of Strength)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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