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