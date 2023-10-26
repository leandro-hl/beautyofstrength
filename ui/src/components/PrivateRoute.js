import React, {Component} from "react"
import {Redirect, Route} from "react-router-dom"
import {AppContext} from "../context";
import Cookies from "universal-cookie";
import {isLocalhost} from "../functions";

class PrivateRoute extends Component {
    static contextType = AppContext

    render() {
        const {component: Component, ...rest} = this.props;
        let authToken = null
        if (!isLocalhost()) {
            const cookies = new Cookies({ path: '/' });
            authToken = cookies.get("auth_token")
        } else {
            authToken = 'chaja'
        }

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