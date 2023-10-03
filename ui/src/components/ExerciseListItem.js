import React, {Component, createRef} from "react";
import {Grid, Input, Label, List} from "semantic-ui-react";

export class ExerciseListItem extends Component {
    inputRef = createRef()

    constructor(props) {
        super(props);
        this.state = {value: null}
    }

    componentDidMount() {
        this.inputRef.current.focus()
    }

    handleChange(value) {
        this.setState({value: value})
        if (10 / value <= 1) {
            this.props.finished(value)
        }
    }

    handleKeyDown(event) {
        if (event.key === 'Enter') {
            const {value} = this.state;
            this.props.finished(value)
        }
    };

    render() {
        return (
            <List.Item key={this.props.item.key}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={12} stretched style={{paddingRight: 0}}>
                            <Label basic style={{width: '100%', padding: 20}}>{this.props.item.text}</Label>
                        </Grid.Column>
                        <Grid.Column width={4} stretched style={{paddingLeft: 0}}>
                            <Input fluid
                                   ref={this.inputRef} placeholder='10' type={'number'}
                                   min={1}
                                   max={99}
                                   onKeyDown={(event) => this.handleKeyDown(event)}
                                   onChange={(e, {value}) => this.handleChange(value)}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </List.Item>
        )
    }
}