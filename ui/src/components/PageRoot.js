import React, {Component} from "react";
import {Redirect, Route, withRouter} from "react-router-dom";
import {AppContext, setData} from "../context";
import {isLocalhost} from "../functions";
import {checkAuth, getLocalInfo, getUserPermissions} from "../service";
import {Loader} from "semantic-ui-react";
import axios from "axios";

class PageRoot extends Component {
    static contextType = AppContext
    state = {loading:true}

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
            // this.props.history.push('/signin')
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

    componentDidMount() {
        this.checkAuth()
    }

    render() {
        const {component: Component, ...rest} = this.props;
        const {state: {
            isAuthenticated,
            permissions: {
                menuhomeprofessor,
                menuhomestudent
            }
        }} = this.context

        return <Route {...rest} render={(props) => {
            if (this.state.loading) {
                return <Loader active/>
            }

            if (!isAuthenticated) {
                return  <Redirect to={{
                    pathname: '/home',
                    search: props.location.search,
                    state: { from: props.location }
                }} />
            }

            if (isAuthenticated && menuhomeprofessor) {
                return <Redirect to={{
                    pathname: '/my-planifications',
                    search: props.location.search,
                    state: { from: props.location }
                }} />
            }

            if (isAuthenticated && menuhomestudent) {
                return <Redirect to={{
                    pathname: '/student',
                    search: props.location.search,
                    state: { from: props.location }
                }} />
            }
        }} />
    }
}

export default withRouter(PageRoot)