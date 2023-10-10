import React, {Component, createRef} from "react";
import {Button, Divider, Dropdown, Grid, Header, Input, Label, List, Segment} from "semantic-ui-react";
import {signIn} from "../service";
import {withRouter} from "react-router-dom";
import {queryParam} from "../functions";

class PageRoutineCreate extends Component {
    constructor(props) {
        super(props);
        const planificationId = queryParam(props, 'planificationId')
        const routineNumber = queryParam(props, 'routineNumber')
        this.state = {planificationId: planificationId, routineName: 'Dia '+routineNumber, routineNumber}
    }

    async componentDidMount() {
        try {
            this.setState({loading: true})
            await signIn('juan123')
        } catch (e) {
            console.error(e)
        }
    }

    redirectToCreateBlock() {
        const {planificationId,routineNumber} = this.state;
        this.props.history.push('/block/create?planificationId='+planificationId+'&routineNumber='+routineNumber)
    }

    render() {
        const {routineName} = this.state;
        return (
            <Segment basic style={{height: '100%'}}>
                <Header as={'h3'}>{routineName}</Header>
                <Button fluid onClick={() => this.redirectToCreateBlock()}>Agregar Bloque</Button>
            </Segment>
        )
    }
}

export default withRouter(PageRoutineCreate);