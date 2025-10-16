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

import React, {Component, useState} from "react";
import {Header, Icon, List, Loader, Message, Segment} from "semantic-ui-react";
import {listLatestEvents, listPlanifications} from "../service";
import {withRouter} from "react-router-dom";
import {AppContext, setData} from "../context";
import BottomMenuBar from "./BottomMenuBar";
import LayoutMobile from "./LayoutMobile";
import {MENU} from "../enums";

const MenuHeaderRender = () => {
    return <>Comunidad</>
}

class PageProfessorContributions extends Component {
    static contextType = AppContext
    state = {loading: true}

    async componentDidMount() {
        try {
            const res = await listLatestEvents()
            this.context.dispatch(setData({
                noBottomBar: false,
                menuButtonSelected: MENU.CONTRIBUTIONS,
                MenuHeaderRender: <MenuHeaderRender/>
            }))
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
                {events.length === 0 && <Message><Message.Content>No hay eventos que mostrar</Message.Content></Message>}
                {events.map((e,i) => (<Segment key={i}>{e}</Segment>))}
            </>
        )
    }
}

export default withRouter(PageProfessorContributions);