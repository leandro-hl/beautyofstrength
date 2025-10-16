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

import React, {Component, createRef, useState} from "react";
import {
    Button,
    Divider,
    Dropdown,
    Grid,
    Header,
    Icon,
    Input,
    Label,
    List,
    Loader,
    Message,
    Segment
} from "semantic-ui-react";
import {signIn} from "../service";
import {withRouter} from "react-router-dom";
import {queryParam} from "../functions";
import {AppContext, setData} from "../context";
import BottomMenuBar from "./BottomMenuBar";
import LayoutMobile from "./LayoutMobile";
import {MENU} from "../enums";
import {ModalBlockCreate} from "./ModalBlockCreate";
import {ReactComponent as BackArrowIcon} from '../icons/arrow_back.svg'

const MenuHeaderRender = ({routineName, onGoBack, onRoutineNameChange}) => {
    const [name, setRoutineName] = useState(routineName)
    return <>
        <Button className={'header-back-arrow'} icon onClick={() => onGoBack()}>
            <BackArrowIcon/>
        </Button>
        <Input
            className={'input-header'}
            placeholder={name}
            value={name}
            onChange={(e, {value}) => {
                setRoutineName(value)
                onRoutineNameChange(value)
            }}/>
    </>
}

class PageRoutineCreate extends Component {
    static contextType = AppContext
    constructor(props) {
        super(props);
        this.state = {
            planificationId: null,
            routineName: '',
            routineNumber: null,
            loading: true,
            showCreateBlockModal: false,
            nextBlockNumber: 1
        }
    }

    onRoutineNameChange(newName) {
        this.context.dispatch(setData({routineName: newName}))
    }

    async componentDidMount() {
        try {
            const {nextBlockNumber} = this.state
            const {state: {routineName, routineNumber, planificationId, isTemplate}} = this.context
            this.context.dispatch(setData({
                secondaryActions: [
                    {func: () => this.addBlock(), description: 'Agregar Bloque'}
                ],
                noBottomBar: false,
                menuButtonSelected: isTemplate? MENU.INSTRUCTOR_SUITE : MENU.PLANIFICATIONS,
                MenuHeaderRender: <MenuHeaderRender
                    routineName={routineName}
                    onRoutineNameChange={(newName) => this.onRoutineNameChange(newName)}
                    onGoBack={() => isTemplate ? this.redirectToSuite() : this.redirectToPlanification()}
                />
            }))
            this.context.dispatch(setData({routineId: null, nextBlockNumber}, true))
            this.setState({
                planificationId: planificationId,
                routineNumber
            })
        } catch (e) {
            console.error(e)
        } finally {
            this.setState({loading: false})
        }
    }

    addBlock() {
        this.setState({ showCreateBlockModal: true });
    }

    redirectToCreateBlock() {
        this.props.history.push('/block/create')
    }

    redirectToPlanification() {
        this.props.history.push('/planification')
    }

    redirectToSuite() {
        this.props.history.push('/suite')
    }

    handleConfirm() {
        try {
            const {newBlockName, nextBlockNumber} = this.state
            this.context.dispatch(setData({
                nextWorkNumber: 1,
                newBlockGroupName: newBlockName ? newBlockName : 'Bloque '+nextBlockNumber,
                newBlockGroupId: null}, true))
            this.redirectToCreateBlock()
        } catch (e) {
            console.error(e)
        }
        this.handleClose();
    }

    handleClose = () => {
        this.setState({ showCreateBlockModal: false });
    }

    render() {
        const {loading, showCreateBlockModal, nextBlockNumber} = this.state;

        if (loading){
            return <Loader active/>
        }

        return (
            <>
                <Message>
                    <Message.Header>Rutina Vacia</Message.Header>
                    <p>Comienza agregando algunos bloques de trabajo</p>
                </Message>
                <ModalBlockCreate
                    open={showCreateBlockModal}
                    next={nextBlockNumber}
                    onChange={(name)=> this.setState({newBlockName: name})}
                    onClose={() => this.handleClose()}
                    onConfirm={() => this.handleConfirm()}/>
            </>
        )
    }
}

export default withRouter(PageRoutineCreate);