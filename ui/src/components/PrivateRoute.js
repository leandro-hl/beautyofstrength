import React, {Component} from "react"
import {Redirect, Route} from "react-router-dom"
import {AppContext, setData} from "../context";
import Cookies from "universal-cookie";
import {isLocalhost} from "../functions";
import {checkAuth, getLocalInfo, getUserPermissions} from "../service";
import axios from "axios";

class PrivateRoute extends Component {
    static contextType = AppContext

    async loadLocalEnvironment() {
        try {
            const {state: {auth_token}}=this.context
            if (!auth_token) {
                const res = await getLocalInfo();
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data}`;
                this.context.dispatch(setData({auth_token: res.data}))
            } else {
                axios.defaults.headers.common['Authorization'] = `Bearer ${auth_token}`;
            }
        } catch (e) {
            console.error(e)
            localStorage.removeItem("state")
            this.props.history.push('/signin')
            this.context.dispatch(setData({auth_token: null, noMenu: true, secondaryActions:[]}))
        }
    }

    async componentDidMount() {
        try {
            const {state: {isAuthenticated}} = this.context
            if (isAuthenticated === undefined) {
                if (isLocalhost()) {
                    await this.loadLocalEnvironment()
                    const b = await getUserPermissions();
                    this.context.dispatch(setData({isAuthenticated: true, permissions: b.data, noMenu: false}))
                } else {
                    const a = await checkAuth()
                    const b = await getUserPermissions();
                    this.context.dispatch(setData({isAuthenticated: a.data, permissions: b.data, noMenu: false, secondaryActions:[]}))
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