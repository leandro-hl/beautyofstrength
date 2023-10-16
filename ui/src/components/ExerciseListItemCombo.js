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
                                <Grid.Row>
                                    <Icon name="chevron up" className={'chevron-up'} onClick={() => this.props.moveUp()}/>
                                    <Icon name="chevron down" className={'chevron-down'} onClick={() => this.props.moveDown()}/>
                                    {this.props.item.text}
                                    <Icon name={'sync'} className={'list-item-icon'} onClick={() => this.props.onRepeat(this.props.item)}/>
                                </Grid.Row>
                                <Grid.Row>
                                    <span style={{fontSize: '0.6em'}}>agregado por: {this.props.item.createdbyuser}</span>
                                </Grid.Row>
                            </Label>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </List.Item>
        )
    }
}