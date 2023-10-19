import React, {Component} from "react"
import {Redirect, Route} from "react-router-dom"
import {AppContext} from "../context";

class PrivateRoute extends Component {
    static contextType = AppContext

    render() {
        const {component: Component, ...rest} = this.props;
        // const {state: {authToken}} = this.context
        //todo: this will be the session cookie...
        const authToken = 'chaja'
        return <Route {...rest} render={(props) => (
            authToken
                ? <Component {...props} />
                : <Redirect to={{
                    pathname: '/signin',
                    search: props.location.search,
                    state: { from: props.location }
                }} />
        )} />
    }
}

export default PrivateRoute;