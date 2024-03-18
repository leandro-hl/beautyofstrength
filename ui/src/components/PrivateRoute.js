import React, {Component} from "react"
import {Redirect, Route} from "react-router-dom"
import {AppContext, setData} from "../context";
import Cookies from "universal-cookie";
import {isLocalhost} from "../functions";
import {checkAuth, getLocalInfo, getUserPermissions, listEquipment} from "../service";
import axios from "axios";
import {Loader} from "semantic-ui-react";

class PrivateRoute extends Component {
    state = {loading: true}
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

    async checkAuth() {
        try {
            const {state: {isAuthenticated}} = this.context
            if (!isAuthenticated) {
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
        } finally {
            this.setState({loading: false})
        }
    }

    async listEquipment() {
        try {
            const {state: {equipment}} = this.context

            if (!equipment) {
                const res = await listEquipment()
                this.context.dispatch(setData({equipment: res.data}, true))
            }
        } catch (e) {
            console.error(e)
        }
    }

    async componentDidMount() {
        await this.checkAuth()
        await this.listEquipment();
    }

    render() {
        const {component: Component, ...rest} = this.props;
        const {state: {isAuthenticated}} = this.context
        const {loading} = this.state

        const func = (props) => {
            if (loading) {
                return <Loader active/>
            }
            return isAuthenticated
                ? <Component {...props} />
                : <Redirect to={{
                    pathname: '/signin',
                    search: props.location.search,
                    state: {from: props.location}
                }}/>
        }
        return <Route {...rest} render={func}/>
    }
}

export default PrivateRoute;