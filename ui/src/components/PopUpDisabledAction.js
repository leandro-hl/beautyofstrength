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
import {Popup} from "semantic-ui-react";

export class PopUpDisabledAction extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            header: props.disableHeader ?? 'Pasate a Premium!',
            description: props.disableDescription ?? 'Con Premium obtene beneficios y desbloquea todas las funcionalidades'
        }
    }

    handleOpen = () => {
        this.setState({ isOpen: true })

        this.timeout = setTimeout(() => {
            this.setState({ isOpen: false })
            clearTimeout(this.timeout)
        }, 2500)
    }

    handleClose = () => {
        this.setState({ isOpen: false })
        clearTimeout(this.timeout)
    }

    render() {
        return (
            <Popup
                open={this.state.isOpen}
                onClose={() => this.handleClose()}
                onOpen={() => this.handleOpen()}
                trigger={this.props.trigger} on={'click'} position={'top left'}>
                <Popup.Header>{this.state.header}</Popup.Header>
                <Popup.Content>{this.state.description}</Popup.Content>
            </Popup>
        )
    }
}