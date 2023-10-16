import React, {Component, createRef} from "react";
import {Button, Divider, Dropdown, Grid, Header, Icon, Input, Label, List, Loader, Segment} from "semantic-ui-react";
import {signIn} from "../service";
import {withRouter} from "react-router-dom";
import {queryParam} from "../functions";
import {AppContext} from "../context";

class PageRoutineCreate extends Component {
    static contextType = AppContext
    constructor(props) {
        super(props);
        this.state = {planificationId: null, routineName: '', routineNumber: null}
    }

    async componentDidMount() {
        try {
            const {state: {routineNumber, planificationId}} = this.context
            this.setState({loading: true})
            await signIn('juan123')
            this.setState({planificationId: planificationId, routineName: 'Dia '+routineNumber, routineNumber})
        } catch (e) {
            console.error(e)
        } finally {
            this.setState({loading: false})
        }
    }

    redirectToCreateBlock() {
        const {planificationId,routineNumber} = this.state;
        this.props.history.push('/block/create')
    }

    render() {
        const {routineName, loading} = this.state;

        if (loading){
            return <Loader active/>
        }

        return (
            <Segment basic style={{height: '100%'}}>
                <Header as={'h3'}>
                    {routineName}
                </Header>
                <Button fluid onClick={() => this.redirectToCreateBlock()}>Agregar Bloque</Button>
            </Segment>
        )
    }
}

export default withRouter(PageRoutineCreate);