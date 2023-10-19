import React, {Component, createRef} from "react";
import {Button, Divider, Dropdown, Grid, Header, Icon, Input, Label, List, Loader, Segment} from "semantic-ui-react";
import {signIn} from "../service";
import {withRouter} from "react-router-dom";
import {queryParam} from "../functions";
import {AppContext, setData} from "../context";
import BottomMenuBar from "./BottomMenuBar";
import LayoutMobile from "./LayoutMobile";

class PageRoutineCreate extends Component {
    static contextType = AppContext
    constructor(props) {
        super(props);
        this.state = {planificationId: null, routineName: '', routineNumber: null}
    }

    async componentDidMount() {
        try {
            const {state: {routineNumber, planificationId}} = this.context
            this.context.dispatch(setData({secondaryActions: [
                    {func: () => this.redirectToPlanification(), description: 'Rutinas'},
                    {func: () => this.redirectToCreateBlock(), description: 'Agregar Bloque'}
                ]}))
            this.setState({loading: true})
            this.setState({planificationId: planificationId, routineName: 'Dia '+routineNumber, routineNumber})
        } catch (e) {
            console.error(e)
        } finally {
            this.setState({loading: false})
        }
    }

    redirectToCreateBlock() {
        this.props.history.push('/block/create')
    }

    redirectToPlanification() {
        this.props.history.push('/planification')
    }

    render() {
        const {routineName, loading} = this.state;

        if (loading){
            return <Loader active/>
        }

        return (
            <>
                <Header as={'h3'}>
                    {routineName}
                </Header>
            </>
        )
    }
}

export default withRouter(PageRoutineCreate);