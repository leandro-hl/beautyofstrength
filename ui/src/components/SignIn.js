import React, { Component } from 'react';
import {Button, Divider, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';
import {AppContext} from "../context";
import {Link, NavLink, withRouter} from "react-router-dom";
import {signIn} from "../service";

class SignIn extends Component {
    static contextType = AppContext
    state = { username: '', password: '' }

    componentDidMount() {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        document.body.appendChild(script);
    }
    // handleChange = (e, { name, value }) => {
    //     this.setState({ [name]: value });
    // }
    //
    // async handleSubmit() {
    //     try {
    //         this.setState({loading: true})
    //         const { username, password } = this.state;
    //         const res = await signIn(username, password)
    //         this.setState({loading: false})
    //     } catch (e) {
    //         console.error(e)
    //     }
    // }

    render() {
        // const { username, password } = this.state;
        return (
            <>
                <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                    <Grid.Row>
                        <div id="g_id_onload"
                             data-client_id="657396100962-5ndfs6l6o08m44ja0dbahb23oetd8134.apps.googleusercontent.com"
                             data-context="use"
                             data-ux_mode="redirect"
                             data-login_uri="http://localhost:3001/api/googlesignin"
                             data-auto_prompt="false">
                        </div>
                        <div className="g_id_signin"
                             data-type="standard"
                             data-shape="pill"
                             data-theme="outline"
                             data-text="continue_with"
                             data-size="large"
                             data-locale="es-419"
                             data-logo_alignment="left">
                        </div>
                    </Grid.Row>
                    {/*<Grid.Row style={{padding:20}}>*/}
                    {/*    <Grid.Column style={{ maxWidth: 450 }}>*/}
                    {/*        <Header as='h2' color='teal' textAlign='center'>*/}
                    {/*            /!*<Image src='/logo.png' /> Log-in to your account*!/*/}
                    {/*        </Header>*/}
                    {/*        <Form size='large' onSubmit={() => this.handleSubmit()}>*/}
                    {/*            <Segment stacked>*/}
                    {/*                <Form.Input*/}
                    {/*                    fluid*/}
                    {/*                    icon='user'*/}
                    {/*                    iconPosition='left'*/}
                    {/*                    placeholder='Usuario'*/}
                    {/*                    name='username'*/}
                    {/*                    value={username}*/}
                    {/*                    onChange={this.handleChange}/>*/}
                    {/*                <Form.Input*/}
                    {/*                    fluid*/}
                    {/*                    icon='lock'*/}
                    {/*                    iconPosition='left'*/}
                    {/*                    placeholder='Contraseña'*/}
                    {/*                    type='password'*/}
                    {/*                    name='password'*/}
                    {/*                    value={password}*/}
                    {/*                    onChange={this.handleChange}*/}
                    {/*                />*/}
                    {/*                <Button color='teal' fluid size='large'>*/}
                    {/*                    Loguearse*/}
                    {/*                </Button>*/}
                    {/*            </Segment>*/}
                    {/*        </Form>*/}
                    {/*        <Message>*/}
                    {/*            No tenes cuenta? <NavLink to={'/signup'}>Registrate</NavLink>*/}
                    {/*        </Message>*/}
                    {/*    </Grid.Column>*/}
                    {/*</Grid.Row>*/}
                </Grid>
            </>
        )
    }
}

export default withRouter(SignIn);