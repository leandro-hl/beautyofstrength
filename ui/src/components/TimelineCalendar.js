import React from 'react';
import DatePicker, {registerLocale, setDefaultLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Segment} from "semantic-ui-react";
import { es } from 'date-fns/locale/es';
registerLocale('es', es)
setDefaultLocale('es')

class TimeLineCalendar extends React.Component {
    state = {
        startDate: new Date()
    };

    handleChange = date => {
        this.setState({
            startDate: date
        });
    };

    render() {

        return (
            <Segment basic style={{display: 'flex', justifyContent: 'center'}}>
                <DatePicker
                    calendarClassName='timeline-calendar'
                    locale="es"
                    selected={this.state.startDate}
                    onChange={this.handleChange}
                    inline
                />
            </Segment>
        );
    }
}
export default TimeLineCalendar;