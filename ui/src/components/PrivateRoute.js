import React, {Component} from "react"
import {Redirect, Route} from "react-router-dom"
import {AppContext} from "../context";

class PrivateRoute extends Component {
    static contextType = AppContext

    render() {
        const {component: Component, ...rest} = this.props;
        const {state: {authToken}} = this.context
        return <Route {...rest} render={(props) => (
            authToken
                ? <Component {...props} />
                : <Redirect to={{
                    pathname: '/',
                    search: props.location.search,
                    state: { from: props.location }
                }} />
        )} />
    }
}

export default PrivateRoute;