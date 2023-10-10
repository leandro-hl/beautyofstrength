import React, {Component, createRef} from "react";
import {Grid, Input, Label, List} from "semantic-ui-react";

export class ExerciseListItemCircuitInterval extends Component {
    constructor(props) {
        super(props);
        this.state = {value: null}
    }

    render() {
        return (
            <List.Item key={this.props.item.key}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column stretched>
                            <Label basic style={{padding: 20}}>{this.props.item.text}</Label>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </List.Item>
        )
    }
}