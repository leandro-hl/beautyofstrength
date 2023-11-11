import React, {Component} from "react";
import {Grid, List, Loader, Image, Segment, Table, Checkbox, Icon} from "semantic-ui-react";
import {getUserAccountDetails, signout} from "../service";
import {Link, withRouter} from "react-router-dom";
import {AppContext, setData} from "../context";
import {MENU} from "../enums";
import {contactByWhatsapp, setTheme} from "../functions";

class PageAccount extends Component {
    static contextType = AppContext
    state = {loading: true, userAccount: {}}

    async componentDidMount() {
        try {
            this.context.dispatch(setData({
                noBottomBar: false,
                menuButtonSelected: MENU.ACCOUNT,
                secondaryActions: [{func: () => this.signout(), description: 'Salir'}]}))
            const res = await getUserAccountDetails();
            this.setState({loading: false, userAccount: res.data})
        } catch (e) {
            console.error(e)
        }
    }

    componentWillUnmount() {
        this.context.dispatch(setData({secondaryActions: []}))
    }

    async signout() {
        try {
            await signout();
            localStorage.removeItem("state")
            this.context.dispatch(setData({auth_token: null, noMenu: true, secondaryActions:[]}))
            this.props.history.push('/signin')
        } catch (e) {
            console.error(e)
        }
    }

    changeTheme() {
        const {state: {darkTheme}} = this.context
        const newChoice = !darkTheme
        localStorage.setItem('darkTheme', newChoice.toString())
        setTheme(newChoice)
        this.context.dispatch(setData({darkTheme: newChoice}))
    }

    render() {
        const {state: {darkTheme}} = this.context
        const {loading, userAccount} = this.state;

        if (loading) {
            return <Loader active/>
        }

        return (
            <Grid>
                <Grid.Column>
                    <Grid.Row className={'center-content'} style={{marginBottom: '1em'}}>
                        <Image src={userAccount.pictureurl} size='tiny' circular/>
                    </Grid.Row>
                    <Grid.Row>
                        <Segment className={'no-padding'}>
                            <Table basic unstackable style={{border: 'unset'}}>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>Nombre</Table.Cell>
                                        <Table.Cell>{userAccount.name}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Email</Table.Cell>
                                        <Table.Cell>{userAccount.email}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Tema oscuro</Table.Cell>
                                        <Table.Cell><Checkbox toggle checked={darkTheme} onChange={() => this.changeTheme()} /></Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Plan</Table.Cell>
                                        <Table.Cell>{userAccount.accounttype}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Contacto</Table.Cell>
                                        <Table.Cell>
                                            <Icon name={'whatsapp'} size={'large'} className={'icon-pointer'}
                                                  onClick={() => contactByWhatsapp(userAccount.accounttype)}/></Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                            <Grid padded>
                                <Grid.Row className={'no-top-padding'}>
                                    <Grid.Column>
                                        <Link to={'/terms'}>Términos y condiciones</Link>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row className={'no-top-padding'}>
                                    <Grid.Column>
                                        <Link to={'/privacy-policies'}>Declaración de Privacidad</Link>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row className={'no-top-padding'}>
                                    <Grid.Column>
                                        <Link to={'/plans'}>Planes disponibles</Link>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        )
    }
}

export default withRouter(PageAccount);