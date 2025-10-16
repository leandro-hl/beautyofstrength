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

import React, {Component} from "react";
import {ButtonGroup, Button, Icon, Tooltip, Grid} from "@mui/material";
import {withRouter} from "react-router-dom";
import {AppContext} from "../../context";

class SingleActionMenuBar extends Component {
    static contextType = AppContext

    render() {
        const {state: {singleActionMenuBar:{onAction, disable, actionTitle}}} = this.context;

        return (
            <Grid container style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                maxWidth: 600,
                height: 80,
                borderTop: '1.482px solid rgba(255, 255, 255, 0.15)',
                backgroundColor: '#121212',
            }} alignItems={'center'} justifyContent={'center'}>
                <Grid item>
                    <Button
                        style={{transition: 'width .5s'}}
                        disabled={disable} variant={'contained'} onClick={() => onAction()}>{actionTitle}</Button>
                </Grid>
            </Grid>
        )
    }
}

export default withRouter(SingleActionMenuBar);