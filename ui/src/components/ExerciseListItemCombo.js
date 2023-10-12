import React, {Component, createRef} from "react";
import {Button, Grid, Icon, Input, Label, List} from "semantic-ui-react";

export class ExerciseListItemCombo extends Component {
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
                            <Label basic style={{padding: 20}} className={this.props.selected ? 'mine-selected' : ''}>
                                <span className="chevron-up" onClick={() => this.props.moveUp()}>&#9650;</span>
                                <span className="chevron-down" onClick={() => this.props.moveDown()}>&#9660;</span>
                                {this.props.item.text}
                                <Icon name={'sync'} className={'list-item-icon'} onClick={() => this.props.onRepeat(this.props.item)}/>
                            </Label>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </List.Item>
        )
    }
}