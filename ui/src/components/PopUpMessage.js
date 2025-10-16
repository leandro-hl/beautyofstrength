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
import {Message, Popup} from "semantic-ui-react";
import {AppContext, showWarning} from "../context";

export class PopUpMessage extends Component {
    static contextType = AppContext

    render() {
        const {state: {popupMessage: {show, title, description, negative, warning, time}}} = this.context
        return (
            <Popup
                wide
                position={'top center'}
                open={show} basic className={'no-padding'}
                trigger={<div className={'popup-message'} style={{position: 'absolute', width: '100%', bottom: 100}}/>}>
                <Popup.Content>
                    <Message negative={negative} positive={!negative} warning={warning}>
                        <Message.Header>{title}</Message.Header>
                        <Message.Content>
                            {description}
                        </Message.Content>
                    </Message>
                </Popup.Content>
            </Popup>
        )
    }
}