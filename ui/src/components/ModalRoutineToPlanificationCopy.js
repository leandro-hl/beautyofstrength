import React, {Component} from "react";
import {Button, Dropdown, Input, Modal} from "semantic-ui-react";
import {listPlanifications} from "../service";
import {AppContext, setData} from "../context";

export class ModalRoutineToPlanificationCopy extends Component {
    static contextType = AppContext
    state = {}
    async componentDidMount() {
        try {
            const {state: {myPlanifications}} = this.context

            if (myPlanifications) {
                this.setState({loading: false, options: myPlanifications.map(e => ({key: e.id, value: e.id, text: e.name}))})
            } else {
                const res = await listPlanifications();
                const ownedPlanifications = res.data.filter(p => p.owner);
                this.setState({loading: false, options: ownedPlanifications.map(e => ({key: e.id, value: e.id, text: e.name}))})
                this.context.dispatch(setData({myPlanifications: ownedPlanifications}, true))
            }
        } catch (e) {
            console.error(e)
        }
    }

    handleSelection = (e, { value }) => this.setState({selectedPlanification: value })

    handleClose() {
        this.props.handleClose()
        this.setState({selectedPlanification: null})
    }

    handleConfirm() {
        this.props.handleConfirm(this.state.selectedPlanification)
        this.setState({selectedPlanification: null})
    }

    render() {
        const {selectedPlanification, options} = this.state
        return (
            <Modal
                open={true}
                size={"tiny"}
                dimmer={'blurring'}
            >
                <Modal.Header>
                    Copiar a Planificacion
                </Modal.Header>
                <Modal.Content>
                    <Dropdown
                        placeholder={'Planificacion'}
                        fluid
                        search
                        selection
                        options={options}
                        value={selectedPlanification}
                        onChange={this.handleSelection}
                        openOnFocus={true}
                        tabIndex={0}
                        noResultsMessage={'No se encontro la planificacion'}
                        selectOnBlur={false}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={() => this.handleClose()}>Cancelar</Button>
                    <Button primary onClick={() => this.handleConfirm()}>Copiar</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}