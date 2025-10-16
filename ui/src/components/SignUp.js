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

import React, { Component } from 'react';
import {Button, Divider, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';
import {AppContext} from "../context";
import {withRouter} from "react-router-dom";
import {signUp} from "../service";

class SignUp extends Component {
    static contextType = AppContext
    state = { username: '', password: '' }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    }

    async handleSignUp() {
        try {
            this.setState({loading: true})
            const { username, password } = this.state;
            const res = await signUp({username, password})
            this.setState({loading: false})
        } catch (e) {

        }
    }

    render() {
        const { username, password } = this.state;

        return (
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Row style={{padding:20}}>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='teal' textAlign='center'>
                            {/*<Image src='/logo.png' /> Log-in to your account*/}
                        </Header>
                        <Form size='large' onSubmit={() => this.handleSubmit()}>
                            <Segment stacked>
                                <Form.Input
                                    fluid
                                    icon='user'
                                    iconPosition='left'
                                    placeholder='Usuario'
                                    name='username'
                                    value={username}
                                    onChange={this.handleChange}/>
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Contraseña'
                                    type='password'
                                    name='password'
                                    value={password}
                                    onChange={this.handleChange}
                                />

                                <Button color='teal' fluid size='large'>
                                    Crear Cuenta
                                </Button>
                            </Segment>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default withRouter(SignUp);