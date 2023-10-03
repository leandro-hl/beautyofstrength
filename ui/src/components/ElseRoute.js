import React, {Component} from "react"
import {Redirect, Route} from "react-router-dom"
import {AppContext} from "../context";

class ElseRoute extends Component {
    static contextType = AppContext

    render() {
        const {component: Component, ...rest} = this.props;
        const {state: {authToken}} = this.context

        const redirectTo = '/signIn'
        return <Route {...rest} render={(props) => (
            <Redirect to={{
                pathname: redirectTo,
                search: props.location.search,
                state: { from: props.location }
            }} />
        )} />
    }
}


export default ElseRoute;