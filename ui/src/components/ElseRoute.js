/**
 * Copyright 2025 Leandro Herenu - BOS (Beauty Of Strength)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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