import React, {Component} from "react";
import {Button, Divider,Grid} from "semantic-ui-react";
import { withRouter } from "react-router-dom"

class Home extends Component {
    render() {
        return (
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Button onClick={() => this.props.history.push('/professor')}>Professor Flow</Button>
                    <Divider hidden/>
                    <Button onClick={() => this.props.history.push('/student')}>Student Flow</Button>
                </Grid.Column>
            </Grid>
        );
    }
}

export default withRouter(Home);