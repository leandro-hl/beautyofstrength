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
import {ButtonGroup, Button, Icon, Tooltip} from "@mui/material";
import {withRouter} from "react-router-dom";
import {AppContext} from "../context";
import {MENU} from "../enums";
import {PopUpDisabledAction} from "./PopUpDisabledAction";

class BottomMenuBarV2 extends Component {
    static contextType = AppContext

    constructor(props) {
        super(props);
        this.state = {}
    }

    onClick(name, redirect) {
        const {selected} = this.props
        if (selected !== name) {
            this.props.onSelected(name)
        }
        this.props.history.push(redirect)
    }

    render() {
        const {state: {permissions: {
            menuhomeprofessor,
            menuhomestudent,
            menuplanifications,
            menudiscussions,
            menustatistics
        }}} = this.context;

        const {selected, secondaryActions, noBottomBar} = this.props;

        return (
            <div style={{position: 'absolute', bottom: 0, width: '100%', maxWidth: 600}}>
                {
                    secondaryActions && secondaryActions.length == 2 &&
                    <ButtonGroup variant="outlined" fullWidth>
                        <Button color="secondary" onClick={() => secondaryActions[0].func()}>{secondaryActions[0].description}</Button>
                        {
                            secondaryActions[1].disabled
                                ? <Tooltip title={secondaryActions[1].description}><Button disabled>{secondaryActions[1].description}</Button></Tooltip>
                                : <Button color="primary" onClick={() => secondaryActions[1].func()}>{secondaryActions[1].description}</Button>
                        }
                    </ButtonGroup>
                }
                {
                    secondaryActions && secondaryActions.length == 1 &&
                    <>
                        {secondaryActions[0].disabled &&
                            <PopUpDisabledAction {...secondaryActions[0]} trigger={<Button className={'button-secondary-action-alone disabled-btn'} primary>{secondaryActions[0].description}</Button>}/>}
                        {!secondaryActions[0].disabled &&
                            <Button className={'button-secondary-action-alone'} primary onClick={() => secondaryActions[0].func()}>{secondaryActions[0].description}</Button>}
                    </>
                }
                {
                    !noBottomBar &&
                    <ButtonGroup variant="contained" fullWidth>
                        {menuhomestudent && <Button color={selected === MENU.HOME ? 'primary' : 'default'} startIcon={<Icon name={MENU.HOME} />} onClick={() => this.onClick(MENU.HOME, '/student')}>Inicio</Button>}
                        {menuhomeprofessor && <Button color={selected === MENU.INSTRUCTOR_SUITE ? 'primary' : 'default'} startIcon={<Icon name={MENU.INSTRUCTOR_SUITE} />} onClick={() => this.onClick(MENU.INSTRUCTOR_SUITE, '/suite')}>Crear</Button>}
                        {menuplanifications && <Button color={selected === MENU.PLANIFICATIONS ? 'primary' : 'default'} startIcon={<Icon name={MENU.PLANIFICATIONS} />} onClick={() => this.onClick(MENU.PLANIFICATIONS, '/my-planifications')}>Planificaciones</Button>}
                        {menudiscussions && <Button color={selected === MENU.CONTRIBUTIONS ? 'primary' : 'default'} startIcon={<Icon name={MENU.CONTRIBUTIONS} />} onClick={() => this.onClick(MENU.CONTRIBUTIONS, '/my-contributions')}>Comunidad</Button>}
                        {menustatistics && <Button color={selected === MENU.STATS ? 'primary' : 'default'} startIcon={<Icon name={MENU.STATS} />} onClick={() => this.onClick(MENU.STATS, '/my-stats')}>Estadisticas</Button>}
                        <Button color={selected === MENU.ACCOUNT ? 'primary' : 'default'} startIcon={<Icon name={MENU.ACCOUNT} />} onClick={() => this.onClick(MENU.ACCOUNT, '/account')}>Perfil</Button>
                    </ButtonGroup>
                }
            </div>
        )
    }
}

export default withRouter(BottomMenuBarV2);