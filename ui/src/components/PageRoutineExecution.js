import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Accordion, Button, Header, Segment, Table} from "semantic-ui-react";

class PageRoutineExecution extends Component {
    render() {
        const {name, blocks, planificationId, routineId} = this.state;
        return (
            <Segment basic style={{height: '100%'}}>
                <Header as={'h3'}>{name}</Header>

            </Segment>
        )
    }
}

export default withRouter(PageRoutineExecution);