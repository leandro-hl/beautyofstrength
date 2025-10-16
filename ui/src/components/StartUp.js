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

import {Component} from "react";
import {AppContext, setData} from "../context";
import {Loader} from "semantic-ui-react";
import {withRouter} from "react-router-dom";
import axios from "axios";
import {isLocalhost, queryParam, setTheme} from "../functions";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";

const darkThemeMui = createTheme({
    palette: {
        mode: 'dark',
        text: {
            primary: '#FFFFFF'
        },
        primary: {
            main: '#F8D018',
        },
    },
});

const themeMui = createTheme({
    palette: {
        text: {
            primary: '#000000'
        },
        primary: {
            main: '#F8D018',
        },
    },
});

class StartUp extends Component {
    static contextType = AppContext
    state = {loading: true}

    setTheme() {
        const {state: {darkTheme}} = this.context
        setTheme(darkTheme)
    }

    async componentDidMount() {
        const planShareParam = queryParam(this.props, 'pshare')
        const shareParam = queryParam(this.props, 'share')
        const inviteParam = queryParam(this.props, 'invite')
        if (shareParam) {
            localStorage.setItem('routine-shared', shareParam)
        } else if (planShareParam) {
            const url = new URL(window.location);
            const params = new URLSearchParams(url.search);
            params.delete('pshare');
            window.history.replaceState({}, '', `${url.pathname}?${params}${url.hash}`);
            localStorage.setItem('planification-shared', planShareParam)
        } else if (inviteParam) {
            localStorage.setItem('instructor-invite', inviteParam)
        }
        this.setTheme()
        this.setState({loading: false})
    }
    render() {
        const {loading} = this.state
        if (loading) {
            return <Loader active/>
        }
        const {state: {darkTheme}} = this.context
        const {children} = this.props
        return (
            <ThemeProvider theme={darkTheme ? darkThemeMui : themeMui}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        )
    }
}

export default withRouter(StartUp)