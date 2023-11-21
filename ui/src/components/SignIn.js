import React, { Component } from 'react';
import {Button, Checkbox, Divider, Form, Grid, Header, Image, Label, Message, Segment} from 'semantic-ui-react';
import {AppContext, setData} from "../context";
import {Link, NavLink, withRouter} from "react-router-dom";
import {signIn, signUpWithTestUser} from "../service";
import {isLocalhost} from "../functions";

class SignIn extends Component {
    static contextType = AppContext

    constructor(props) {
        super(props);

        let signinUrl = "https://bos.team/api/googlesignin"
        if (isLocalhost()) {
           signinUrl = "http://localhost:3001/api/googlesignin"
        }
        this.state = {signinUrl, username: '', password: ''}
    }

    componentDidMount() {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        document.body.appendChild(script);
        this.context.dispatch(setData({noBottomBar: true}))
    }

    async signUpWithTestUser(acc) {
        try {
            const res = await signUpWithTestUser(acc, 'btn')
            this.props.history.push(res.data)
        } catch (e) {
            console.error(e)
        }
    }

    render() {
        const { username, password, signinUrl, termsAccepted } = this.state;
        return (
            <>
                <Grid textAlign='center' verticalAlign='middle'>
                    <Grid.Row>
                        <Image src={'logo.webp'} size={'small'} circular style={{height: 150, backgroundColor: '#000000'}}/>
                    </Grid.Row>
                    <Grid.Row>
                        <Header as={'h1'}><b>bOS</b></Header>
                    </Grid.Row>
                    <Grid.Row className={'no-padding'}>
                        <Header as={'h3'}>Beauty Of Strenght</Header>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Header textAlign={'center'} as={'h5'}>El Sistema Operativo del Entrenamiento<br/>(Version Beta)</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <p>Al crear una cuenta acepto los <Link to={'/terms'}>Términos y condiciones</Link> y autorizo el uso de mis datos de acuerdo a la <Link to={'/privacy-policies'}>Declaración de Privacidad</Link>.</p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Segment basic>
                            <div id="g_id_onload"
                                 data-client_id="657396100962-5ndfs6l6o08m44ja0dbahb23oetd8134.apps.googleusercontent.com"
                                 data-context="use"
                                 data-ux_mode="redirect"
                                 data-login_uri={signinUrl}
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
                        </Segment>
                    </Grid.Row>
                    {
                        isLocalhost() &&
                        <>
                            <Grid.Row>
                                <Button onClick={() => this.signUpWithTestUser('s')}>Sign Up With Free Athlete</Button>
                            </Grid.Row>
                            <Grid.Row>
                                <Button onClick={() => this.signUpWithTestUser('z')}>Sign Up With Premium Athlete</Button>
                            </Grid.Row>
                            <Grid.Row>
                                <Button onClick={() => this.signUpWithTestUser('p')}>Sign Up With Instructor</Button>
                            </Grid.Row>
                        </>

                    }

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