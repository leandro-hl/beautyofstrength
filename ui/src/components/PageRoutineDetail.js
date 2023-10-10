import React, {Component} from "react";
import {Button, Header, List, Loader, Segment} from "semantic-ui-react";
import {withRouter} from "react-router-dom";
import {queryParam} from "../functions";
import {getRoutineDetails} from "../service";

class PageRoutineDetail extends Component{
    constructor(props) {
        super(props);
        const planificationId = queryParam(props, 'planificationId')
        const routineId = queryParam(props, 'routineId')
        this.state = {loading: true, name: '', blocks: [], planificationId, routineId}
    }

    async componentDidMount() {
        try {
            const {routineId} = this.state
            const res = await getRoutineDetails(routineId);
            this.setState({loading: false, blocks: res.data.blocks, name: res.data.name, nextBlockNumber: res.data.blocks.length+1})
        } catch (e) {
            console.error(e)
        }
    }

    redirectToBlock(id) {
        this.props.history.push('/routine?id='+id)
    }

    redirectToCreateBlock() {
        const {planificationId, routineId, nextBlockNumber} = this.state;
        this.props.history.push('/block/create?planificationId='+planificationId+'&routineId='+routineId+'&nextBlockNumber='+nextBlockNumber)
    }

    render() {
        const {name, blocks} = this.state;
        const {loading} = this.state;

        if (loading) {
            return <Loader active/>
        }

        return (
            <Segment basic style={{height: '100%'}}>
                <Header as={'h3'}>{name}</Header>
                {blocks.map(p => (<Segment style={{width: '100%'}} key={p.id} onClick={() => this.redirectToBlock(p.id)}>{p.name}</Segment>))}
                <Button fluid onClick={() => this.redirectToCreateBlock()}>Agregar Bloque</Button>
            </Segment>
        )
    }
}

export default withRouter(PageRoutineDetail);