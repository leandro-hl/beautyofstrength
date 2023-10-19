import React, {Component} from "react";
import {List, Loader, Segment} from "semantic-ui-react";
import {listPlanifications} from "../service";
import {withRouter} from "react-router-dom";
import {AppContext, setData} from "../context";
import BottomMenuBar from "./BottomMenuBar";
import LayoutMobile from "./LayoutMobile";

class PageProfessorContributions extends Component {
    static contextType = AppContext
    state = {loading: true, planifications: []}

    async componentDidMount() {
        try {
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
                PageProfessorContributions
            </>
        )
    }
}

export default withRouter(PageProfessorContributions);