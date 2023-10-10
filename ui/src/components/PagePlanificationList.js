import React, {Component} from "react";
import {List, Loader, Segment} from "semantic-ui-react";
import {listPlanifications} from "../service";
import {withRouter} from "react-router-dom";

class PagePlanificationList extends Component {
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
        this.props.history.push('/planification?id='+id)
    }

    render() {
        const {planifications} = this.state;
        const {loading} = this.state;

        if (loading) {
            return <Loader active/>
        }

        return (
            <Segment basic style={{paddingTop: 20}}>
                {planifications.map(p => (<Segment style={{width: '100%'}} key={p.id} onClick={() => this.redirectToPlanification(p.id)}>{p.name}</Segment>))}
            </Segment>
        )
    }
}

export default withRouter(PagePlanificationList);