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

import React from 'react';
import DatePicker, {registerLocale, setDefaultLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Segment} from "semantic-ui-react";
import { es } from 'date-fns/locale/es';
registerLocale('es', es)
setDefaultLocale('es')

class TimeLineCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date()
        };
    }

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
                    highlightDates={this.props.highlightedDates }
                    inline
                />
            </Segment>
        );
    }
}
export default TimeLineCalendar;