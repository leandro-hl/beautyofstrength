import React, {Component} from "react";
import {Redirect, Route, withRouter} from "react-router-dom";
import {AppContext, setData} from "../context";
import {isLocalhost} from "../functions";
import {checkAuth} from "../service";

class PageRoot extends Component {
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
        const {state: {
            isAuthenticated,
            permissions: {
                menuhomeprofessor,
                menuhomestudent
            }
        }} = this.context

        return <Route {...rest} render={(props) => {
            if (isAuthenticated === undefined) {
                return <></>
            }

            if (isAuthenticated && menuhomeprofessor) {
                return <Redirect to={{
                    pathname: '/professor',
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

             return  <Redirect to={{
                 pathname: '/signin',
                 search: props.location.search,
                 state: { from: props.location }
             }} />
        }} />
    }
}

export default withRouter(PageRoot)