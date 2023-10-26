import React, {Component} from "react"
import {Redirect, Route} from "react-router-dom"
import {AppContext, setData} from "../context";
import Cookies from "universal-cookie";
import {isLocalhost} from "../functions";
import {checkAuth} from "../service";

class PrivateRoute extends Component {
    static contextType = AppContext

    async componentDidMount() {
        try {
            const {state: {isAuthenticated}} = this.context
            if (isAuthenticated === undefined) {
                if (isLocalhost()) {
                    this.context.dispatch(setData({isAuthenticated: true}))
                } else {
                    const res = await checkAuth()
                    this.context.dispatch(setData({isAuthenticated: res.data}))
                }
            }
        } catch (e) {
            console.error(e)
        }
    }

    render() {
        const {component: Component, ...rest} = this.props;
        const {state: {isAuthenticated}} = this.context

        return <Route {...rest} render={(props) => (
            isAuthenticated === undefined ? <></> : isAuthenticated
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