import React, {Component} from "react";
import {Header, List, Loader, Segment} from "semantic-ui-react";
import {listPlanifications} from "../service";
import {withRouter} from "react-router-dom";
import {AppContext, setData} from "../context";
import BottomMenuBar from "./BottomMenuBar";
import LayoutMobile from "./LayoutMobile";
import {MENU} from "../enums";

class PageProfessorContributions extends Component {
    static contextType = AppContext
    state = {loading: true, planifications: []}

    async componentDidMount() {
        try {
            this.context.dispatch(setData({noBottomBar: false, menuButtonSelected: MENU.CONTRIBUTIONS}))
            const res = await listPlanifications();
            this.setState({loading: false, planifications: res.data})
        } catch (e) {
            console.error(e)
        }
    }

    redirectToPlanification(id) {
        this.context.dispatch(setData({planificationId: id}))
        this.props.history.push('/planification')
    }

    render() {
        const {planifications} = this.state;
        const {loading} = this.state;

        if (loading) {
            return <Loader active/>
        }

        return (
            <>
                <Header as={'h3'}>Proximamente</Header>
                <Segment>Proximamente podras ver las ultimas contribuciones de la comunidad aqui</Segment>
            </>
        )
    }
}

export default withRouter(PageProfessorContributions);