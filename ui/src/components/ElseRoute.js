import React, {Component} from "react"
import {Redirect, Route} from "react-router-dom"
import {AppContext, setData} from "../context";

class ElseRoute extends Component {
    static contextType = AppContext

    render() {
        const {component: Component, ...rest} = this.props;
        const {dispatch} = this.context
        return <Route {...rest} render={(props) => {
            localStorage.removeItem("state")
            dispatch(setData({auth_token: null, noMenu: true, secondaryActions:[]}))
            return <Redirect to={{
                pathname: '/my-planifications',
                search: props.location.search,
                state: { from: props.location }
            }} />
        }} />
    }
}


export default ElseRoute;