import React, {Component} from "react";
import {getUserAccountDetails, listUserAccountEquipment, signout} from "../../service";
import {Link, withRouter} from "react-router-dom";
import {AppContext, setData, showSuccess} from "../../context";
import {MENU} from "../../enums";
import {capitalize, contactByWhatsapp, setTheme} from "../../functions";
import {
    Avatar, CircularProgress,
    Container,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Paper,
    Stack,
    Switch,
    TextField, Typography
} from "@mui/material";
import {ModalMyEquipmentCreate} from "../ModalMyEquipmentCreate";
import {AccountConfigs} from "./AccountConfigs";
import {LeftTypography, ListItemTextJustifyBetween, RightTypography} from "./customizations";
import {MyEquipment} from "../MyEquipment";

const MenuHeaderRender = () => {
    return <>Perfil</>
}

class PageAccount extends Component {
    static contextType = AppContext
    state = {loading: true, userAccount: {}}

    async componentDidMount() {
        try {
            this.context.dispatch(setData({
                noBottomBar: false,
                menuButtonSelected: MENU.ACCOUNT,
                MenuHeaderRender: <MenuHeaderRender/>,
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
            this.context.dispatch(setData({
                auth_token: null,
                noMenu: true,
                permissions: {},
                isAuthenticated: null,
                secondaryActions:[],
                planificationId: null,
                routineId: null,
                MenuHeaderRender: null
            }))
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
        const {loading, userAccount} = this.state;

        if (loading) {
            return <CircularProgress/>
        }

        return (
            // <Container>
                <Stack>
                    <Paper>
                        <List>
                            <ListItem>
                                <ListItemText align="center">
                                    <Avatar src={userAccount.pictureurl}/>
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText align="center">
                                    {userAccount.name}
                                </ListItemText>
                            </ListItem>
                            <Divider component="li" />
                            <ListItem>
                                <ListItemText>
                                    <LeftTypography>
                                        Email
                                    </LeftTypography>
                                    <RightTypography>
                                        {userAccount.email}
                                    </RightTypography>
                                </ListItemText>
                            </ListItem>
                            <Divider component="li" />
                            <ListItem>
                                <ListItemText>
                                    <LeftTypography>
                                        Plan
                                    </LeftTypography>
                                    <RightTypography>
                                        {userAccount.accounttype}
                                    </RightTypography>
                                </ListItemText>
                            </ListItem>
                        </List>
                    </Paper>
                    <Paper>
                        <AccountConfigs userAccount={userAccount}/>
                    </Paper>
                    <MyEquipment/>
                </Stack>
            // </Container>
        )
    }
}

export default withRouter(PageAccount);