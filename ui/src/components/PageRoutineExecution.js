import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Accordion, Button, Divider, Grid, Header, Loader, Segment, Table} from "semantic-ui-react";
import {AppContext} from "../context";
import {InputNumber} from "./InputNumber";

class PageRoutineExecution extends Component {
    static contextType = AppContext
    constructor(props) {
        super(props);
        this.state={loading: true, routineDetails:{}}
    }

    componentDidMount() {
        const {state: {routineDetails}} = this.context
        console.log(routineDetails)
        this.setState({...routineDetails, currentBlock: 0, loading: false})
    }

    renderExecuteCpt() {
        const {blocks, currentBlock} = this.state
        const block = blocks[currentBlock];
        return (
            <Segment>
                <Header as={'h3'}>Rondas: {block.laps}</Header>
                <Grid columns={2} relaxed='very'>
                    <Grid.Column>
                        <InputNumber label={'Trabajo'} seconds large onChange={({amount}) => this.setState({workingInterval: amount})}/>
                    </Grid.Column>
                    <Grid.Column>
                        <InputNumber label={'Descanso'} seconds large onChange={({amount}) => this.setState({restingInteval: amount})}/>
                    </Grid.Column>
                </Grid>
                <Divider vertical>X</Divider>
            </Segment>
        )
    }

    renderExecuteAmrap() {

    }

    renderExecuteCombo() {

    }

    renderExecutePir() {

    }

    render() {
        const {loading, currentBlock, name, blocks} = this.state;
        if (loading) {
            return <Loader active/>
        }
        return (
            <Segment basic style={{height: '100%'}}>
                <Header as={'h3'}>{name}</Header>

            </Segment>
        )
    }
}

export default withRouter(PageRoutineExecution);