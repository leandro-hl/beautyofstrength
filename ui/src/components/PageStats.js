import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {AppContext, setData} from "../context";
import {MENU} from "../enums";
import {Header, Segment} from "semantic-ui-react";

class PageStats extends Component {
    static contextType = AppContext
    state = {loading: true, plans: []}
    async componentDidMount() {
        try {
            this.context.dispatch(setData({noBottomBar: false, menuButtonSelected: MENU.STATS}))
        } catch (e) {
            console.error(e)
        }
    }

    render() {
        return (
            <>
                <Header as={'h3'}>Proximamente</Header>
                <Segment>Proximamente podras ver todas tus estadisticas en esta pagina</Segment>
            </>
        )
    }
}

export default withRouter(PageStats);