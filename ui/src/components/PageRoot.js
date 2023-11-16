import React, {Component} from "react";
import {Redirect, Route, withRouter} from "react-router-dom";
import {AppContext, setData} from "../context";
import {isLocalhost} from "../functions";
import {checkAuth, getUserPermissions} from "../service";

class PageRoot extends Component {
    static contextType = AppContext

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
            if (!isAuthenticated) {
                return  <Redirect to={{
                    pathname: '/home',
                    search: props.location.search,
                    state: { from: props.location }
                }} />
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
        }} />
    }
}

export default withRouter(PageRoot)