import {withRouter} from "react-router-dom";
import React, {Component} from "react";
import {Header, Checkbox, Loader, Button, Icon, Message} from "semantic-ui-react";
import {AppContext, setData} from "../context";
import {savePlanificationDays} from "../service";

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
            this.redirectToPlanification()
        } catch (e) {
            console.error(e)
        }
    }

    componentDidMount() {
        this.context.dispatch(setData({secondaryActions: [{func: () => this.savePlanificationDays(), description: 'Guardar'}]}))
        this.setState({loading:false})
    }

    onChange(i) {
        const buffer = {...this.state.selectedDays}
        buffer[i] = !buffer[i]
        this.setState({selectedDays: buffer})
    }

    render() {
        if (this.state.loading) {
            return <Loader active/>
        }

        const {state: {planificationName}} = this.context
        const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']
        return (
            <>
                <Header as={'h3'}>
                    <Button className={'header-back-arrow'} icon onClick={() => this.props.history.push('/my-planifications')}>
                        <Icon name={'arrow left'}/>
                    </Button>
                    <span>{planificationName ?? 'Mis Rutinas'}</span>
                </Header>
                <Message>
                    <Message.Header>Semana</Message.Header>
                    <p>Elige los dias de la planificacion. Los estudiantes lo veran reflejado en sus calendarios.</p>
                </Message>
                {days.map((d,i) => <Checkbox checked={this.state.selectedDays[i]} onChange={() => this.onChange(i)} className={'planification-checkbox-day'} key={i} as={Header} label={d} />)}
            </>
        )
    }
}

export default withRouter(PagePlanificationSelectDays)