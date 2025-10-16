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
import {Box, styled, SwipeableDrawer} from "@mui/material";

const Puller = styled('div')(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: 'grey',
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
}));

export class Drawable extends Component {
    state = {
        showDrawer: false,
    }
    render() {
        const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
        const drawerBleeding = 156;
        return (
            <SwipeableDrawer
                disableBackdropTransition={!iOS}
                disableDiscovery={iOS}
                open={this.state.showDrawer}
                onClose={() => this.setState({showDrawer: false})}
                onOpen={() => this.setState({showDrawer: true})}
                anchor="bottom"
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={false}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: -drawerBleeding,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        visibility: 'visible',
                        right: 0,
                        left: 0,
                    }}
                >
                    <Puller />
                    51 results
                </Box>
                CHaja chaja
                chaja congirmacion
            </SwipeableDrawer>
        )
    }
}