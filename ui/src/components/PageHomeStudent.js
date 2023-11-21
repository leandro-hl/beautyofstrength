import React, {Component} from "react";
import {Header, Loader, Message, Segment} from "semantic-ui-react";
import {ModalHaveTrained} from "./ModalHaveTrained";
import {getUserLoadedTrainingToday, listLatestEvents, signIn} from "../service";
import {ModalEnableNotifications} from "./ModalEnableNotifications";
import {withRouter} from "react-router-dom";
import LayoutMobile from "./LayoutMobile";
import {AppContext, setData} from "../context";
import {MENU} from "../enums";

class PageHomeStudent extends Component {
    static contextType = AppContext
    state = {loadedTrainingToday: false, loading: true}

    async componentDidMount() {
        try {
            this.context.dispatch(setData({noBottomBar: false, menuButtonSelected: MENU.HOME}))
            // const res = await getUserLoadedTrainingToday()
            // this.setState({loadedTrainingToday: res.data.loaded, loading: false})
            const res = await listLatestEvents()
            this.setState({events: res.data.events})
        } catch (e) {
            console.error(e)
        } finally {
            this.setState({loading: false})
        }
    }

    render() {
        const {loadedTrainingToday, loading, showSecondModal, events} = this.state;

        if (loading) {
            return <Loader active/>
        }

        return (
            <>
                <>
                    <Header as={'h3'}>Inicio</Header>
                    {events.length === 0 && <Message><Message.Content>No hay eventos que mostrar</Message.Content></Message>}
                    {events.map((e,i) => (<Segment key={i}>{e}</Segment>))}
                </>
                {/*{navigator.serviceWorker && <ModalEnableNotifications onSubscribed={() => this.setState({showSecondModal: true})}/>}*/}
                {
                    showSecondModal && !loadedTrainingToday  &&
                    <ModalHaveTrained/>
                }
            </>
        )
    }
}

export default withRouter(PageHomeStudent);