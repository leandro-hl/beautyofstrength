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

import {withRouter} from "react-router-dom";
import React, {Component} from "react";
import {Header, Checkbox, Loader, Button, Icon, Message} from "semantic-ui-react";
import {AppContext, setData, showSuccess} from "../context";
import {savePlanificationDays} from "../service";
import {ReactComponent as BackArrowIcon} from '../icons/arrow_back.svg'

const MenuHeaderRender = ({planificationName, onGoBack}) => {
    return <>
        <Button className={'header-back-arrow'} icon onClick={() => onGoBack()}>
            <BackArrowIcon/>
        </Button>
        {planificationName ?? 'Mis Rutinas'}
    </>
}

class PagePlanificationSelectDays extends Component {
    static contextType = AppContext
    state = {loading:true, selectedDays: {}}

    redirectToPlanification() {
        this.props.history.push('/planification')
    }

    async savePlanificationDays() {
        try {
            const {state: {planificationId}} = this.context
            const payload = Object.entries(this.state.selectedDays)
                .filter(([key, value]) => value === true)
                .map(([key]) => key);

            await savePlanificationDays({planificationId: planificationId,days: payload.join("")})
            showSuccess(this.context, '', 'Dias de la planificacion seleccionados!')
            this.redirectToPlanification()
        } catch (e) {
            console.error(e)
        }
    }

    setSaveButtonStatus(disabled) {
        this.context.dispatch(setData({
            secondaryActions: [{
                disabled: disabled,
                disableHeader: 'Elegir un dia es requerido',
                disableDescription: 'Debes elegir al menos un dia para crear la planificacion',
                func: () => this.savePlanificationDays(),
                description: 'Guardar'}
            ]}))
    }

    componentDidMount() {
        const {state: {planificationName}} = this.context
        this.context.dispatch(setData({
            MenuHeaderRender: <MenuHeaderRender
                planificationName={planificationName}
                onGoBack={() => this.props.history.push('/my-planifications')}
            />}))
        this.setSaveButtonStatus(true)
        this.setState({loading:false})
    }

    onChange(i) {
        const buffer = {...this.state.selectedDays}
        buffer[i] = !buffer[i]
        this.setState({selectedDays: buffer})
        this.setSaveButtonStatus(Object.entries(buffer).filter(([key, value]) => value === true).length === 0)
    }

    render() {
        if (this.state.loading) {
            return <Loader active/>
        }
        const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']
        return (
            <>
                <Message>
                    <Message.Header>Semana</Message.Header>
                    <p>
                        Elige los dias de la planificacion. Los atletas lo veran reflejado en sus calendarios. Ademas, los atletas que pagan la cuenta élite pueden ver el detalle de las rutinas de toda la semana. Por ejemplo, de una semana con tres dias de entrenamiento, el detalle de las proximas 3 rutinas.
                    </p>
                </Message>
                {days.map((d,i) => <Checkbox checked={this.state.selectedDays[i]} onChange={() => this.onChange(i)} className={'planification-checkbox-day'} key={i} as={Header} label={d} />)}
            </>
        )
    }
}

export default withRouter(PagePlanificationSelectDays)