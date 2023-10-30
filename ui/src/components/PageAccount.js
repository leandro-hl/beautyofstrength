import React, {Component} from "react";
import {Grid, List, Loader, Image, Segment, Table} from "semantic-ui-react";
import {getUserAccountDetails, signout} from "../service";
import {withRouter} from "react-router-dom";
import {AppContext, setData} from "../context";
import {MENU} from "../enums";

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
            this.props.history.push('/signin')
        } catch (e) {
            console.error(e)
        }
    }

    render() {
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
                                        <Table.Cell>Plan</Table.Cell>
                                        <Table.Cell>{userAccount.accounttype}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </Segment>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        )
    }
}

export default withRouter(PageAccount);