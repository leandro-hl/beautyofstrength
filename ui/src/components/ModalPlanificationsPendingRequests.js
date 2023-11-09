import React, {Component} from "react";
import {Button, Grid, Modal, Segment} from "semantic-ui-react";
import {acceptPlanificationAccessRequest, declinePlanificationAccessRequest} from "../service";

export class ModalPlanificationsPendingRequests extends Component {
    state = { showModal: false }

    componentDidMount() {
        this.setState({ showModal: true });
    }

    handleClose = () => {
        this.props.onClose()
    }

    async accept(r,i) {
        try {
            const res = await acceptPlanificationAccessRequest({
                planificationId: r.planification_id,
                requesterUserId: r.useraccount_id
            })
            this.props.onRemove(i)
            //todo success message
        } catch (e) {
            console.error(e)
        }
    }

    async decline(r,i) {
        try {
            const res = await declinePlanificationAccessRequest({
                planificationId: r.planification_id,
                requesterUserId: r.useraccount_id
            })
            this.props.onRemove(i)
            //todo success message
        } catch (e) {
            console.error(e)
        }
    }

    render() {
        return (
            <Modal dimmer={'blurring'} size="mini" open={this.state.showModal} onClose={() => this.handleClose()}>
                <Modal.Header>Solicitudes pendientes</Modal.Header>
                <Modal.Content>
                    {this.props.requests.length === 0 && <>Sin Solicitudes pendientes</>}
                    {this.props.requests.map((r,i) => {
                        return <Segment key={i}>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={10}>
                                        {r.requestername} quiere acceder a {r.planificationname}
                                    </Grid.Column>
                                    <Grid.Column width={6}>
                                        <Button onClick={() => this.accept(r, i)} basic primary icon='check' style={{position: 'relative', float: 'right'}}/>
                                        <Button onClick={() => this.decline(r, i)} basic secondary icon='close' style={{position: 'relative', float: 'right'}}/>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    })}
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={() => this.handleClose()}>Cerrar</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}