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
import {Button, Grid, Header, Icon, Popup} from "semantic-ui-react";

export class PopUpConfirmation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showConfirmation: false
        }
    }

    close() {
        if (!this.props.isManaged) {
            this.setState({showConfirmation: false})
        }
    }

    open() {
        if(!this.props.isManaged){
            this.setState({showConfirmation: true})
        }
    }

    onPrimaryAction() {
        this.close()
        if (this.props.onPrimaryAction){
            this.props.onPrimaryAction()
        }
    }

    onSecondaryAction() {
        this.close()
        if (this.props.onSecondaryAction){
            this.props.onSecondaryAction()
        }
    }

    onTriggerClick() {
        this.open()
        if (this.props.onTriggerClick){
            this.props.onTriggerClick()
        }
    }

    render() {
        const {
            title,
            primary,
            secondary,
            showConfirmation,
            isManaged,
            trigger
        } = this.props

        let open = this.props.open
        let triggerBuf = trigger
        if (!isManaged) {
            open = showConfirmation
            triggerBuf = <Button className={'header-back-arrow'} icon
                              onClick={() => this.onTriggerClick()}>
                <Icon name={'close'}/>
            </Button>
        }

        return (
            <Popup
                size={'small'}
                trigger={triggerBuf}
                position={'bottom right'}
                hoverable
                open={open}
            >
                <Popup.Header>{title}</Popup.Header>
                <Popup.Content>
                    <Grid>
                        {
                            this.props.children ?
                                <Grid.Row>
                                    <Grid.Column>
                                        {this.props.children}
                                    </Grid.Column>
                                </Grid.Row> : null
                        }
                        <Grid.Row className={ this.props.children ? 'no-top-padding' : ''}>
                            <Grid.Column>
                                <Button onClick={() => this.onPrimaryAction()}
                                        primary style={{position: 'relative', float: 'right'}}>
                                    {primary}
                                </Button>
                                <Button onClick={() => this.onSecondaryAction()} secondary style={{position: 'relative', float: 'right'}}>
                                    {secondary}
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Popup.Content>
            </Popup>
        )
    }
}