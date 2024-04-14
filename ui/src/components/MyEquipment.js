import React, {Component} from "react";
import {ModalMyEquipmentCreate} from "./ModalMyEquipmentCreate";
import {Segment, Divider, Table,Icon} from "semantic-ui-react";
import {AppContext, showSuccess} from "../context";
import {addToMyEquipment, listUserAccountEquipment} from "../service";

export class MyEquipment extends Component {
    static contextType = AppContext
    state = {equip:[]}

    async componentDidMount() {
        await this.refreshMyEquipment()
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

    render() {
        const {equip} = this.state
        return (
            <Segment className={'background'}>
                Mi Equipamiento
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
                {this.state.openAddEquipmentModal && <ModalMyEquipmentCreate
                    open={this.state.openAddEquipmentModal}
                    handleClose={() => this.setState({openAddEquipmentModal: false})}
                    handleConfirm={(values) => this.addToMyEquipment(values)}
                />}
            </Segment>
        )
    }
}