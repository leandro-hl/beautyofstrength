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
import {
    Grid,
    List,
    Loader,
    Image,
    Segment,
    Table,
    Checkbox,
    Icon,
    Accordion,
    Button,
    Label,
    Divider
} from "semantic-ui-react";
import {addToMyEquipment, getUserAccountDetails, listUserAccountEquipment, signout} from "../service";
import {Link, withRouter} from "react-router-dom";
import {AppContext, setData, showSuccess} from "../context";
import {MENU} from "../enums";
import {capitalize, contactByWhatsapp, setTheme} from "../functions";
import {Chip} from "./Chip";
import {PopUpConfirmation} from "./PopUpConfirmation";
import {PopUpDisabledAction} from "./PopUpDisabledAction";
import {ModalMyEquipmentCreate} from "./ModalMyEquipmentCreate";
import {AccountConfigs} from "./mui/AccountConfigs";

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
            await this.refreshMyEquipment()
            this.setState({loading: false, userAccount: res.data})
        } catch (e) {
            console.error(e)
        }
    }

    async refreshMyEquipment() {
        try {
            const r = await listUserAccountEquipment();

            const equipRes = r.data
            const equip = []
            let lastName = ''
            let lastIndex = -1
            for (let i = 0; i < equipRes.length; i++) {
                const e = equipRes[i]
                if (e.name !== lastName) {
                    lastName = e.name
                    lastIndex++
                    equip.push({
                        name: e.name,
                        unitsCount: e.units,
                        units: [
                            {
                                weight: e.weight,
                                height: e.height,
                                width: e.width,
                                unitsCount: e.units
                            }
                        ]
                    })
                } else {
                    equip[lastIndex].unitsCount += e.units
                    equip[lastIndex].units.push({
                        weight: e.weight,
                        height: e.height,
                        width: e.width,
                        unitsCount: e.units
                    })
                }
            }

            this.setState({equip})
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

    async addToMyEquipment({selectedEquipment, units, weight, height, width}) {
        try {
            units = units ? parseInt(units, 10) : 1
            weight = weight ? parseFloat(weight.replace(',', '.')) : null
            height = height ? parseFloat(height.replace(',', '.')) : null
            width = width ? parseFloat(width.replace(',', '.')) : null
            await addToMyEquipment({id: selectedEquipment, units, weight, height, width})
            showSuccess(this.context, '', `Equipamiento Agregado!`)
            this.setState({openAddEquipmentModal: false})
            await this.refreshMyEquipment()
        } catch (e) {
            console.error(e)
        }
    }

    renderMyEquipment() {
        const {equip} = this.state
        return (
            <>
                {
                    equip.map((b, i) => {
                        return (
                            <Segment style={{width: '100%'}} className={'no-left-padding no-right-padding'} key={i}>
                                <span className={'padding-left-1 padding-right-1'}>{b.name}   x{b.unitsCount}</span>
                                <Table basic unstackable style={{border: 'unset'}}>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Peso</Table.HeaderCell>
                                            <Table.HeaderCell>Alto</Table.HeaderCell>
                                            <Table.HeaderCell>Ancho</Table.HeaderCell>
                                            <Table.HeaderCell/>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {b.units.map((u, j) => {
                                            return (
                                                <Table.Row key={j} className={'table-row-item'}>
                                                    <Table.Cell>
                                                        {u.weight ? u.weight+'kg' : '-'}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {u.height ? u.height+'cm' : '-'}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {u.width ? u.width+'cm' : '-'}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        x{u.unitsCount}
                                                    </Table.Cell>
                                                </Table.Row>
                                            )
                                        })}
                                    </Table.Body>
                                </Table>
                            </Segment>
                        )
                    })
                }
                <Divider horizontal>
                    <Icon name={'plus'} onClick={() => this.setState({openAddEquipmentModal: true})}/>
                </Divider>
                <ModalMyEquipmentCreate
                    open={this.state.openAddEquipmentModal}
                    handleClose={() => this.setState({openAddEquipmentModal: false})}
                    handleConfirm={(values) => this.addToMyEquipment(values)}
                />
            </>
        )
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
                        <Segment className={'no-padding background'}>
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
                                    <Table.Row>
                                        <Table.Cell className={'last-child-no-bottom'}>Contacto</Table.Cell>
                                        <Table.Cell className={'last-child-no-bottom'}>
                                            <Icon name={'whatsapp'} size={'large'} className={'icon-pointer'}
                                                  onClick={() => contactByWhatsapp(userAccount.accounttype)}/></Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </Segment>
                    </Grid.Row>
                    <Grid.Row>
                        <AccountConfigs/>
                    </Grid.Row>
                    <Grid.Row>
                        <Divider hidden/>
                        <Segment className={'background'}>
                            Mi Equipamiento<br/>
                            {this.renderMyEquipment()}
                        </Segment>
                    </Grid.Row>
                    <Grid.Row>
                        <Divider hidden/>
                        <Segment className={'background'}>
                            <Grid>
                                <Grid.Row>
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