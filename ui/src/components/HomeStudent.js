import React, {Component} from "react";
import {Loader, Segment} from "semantic-ui-react";
import {ModalHaveTrained} from "./ModalHaveTrained";
import {getUserLoadedTrainingToday, signIn} from "../service";
import {ModalEnableNotifications} from "./ModalEnableNotifications";

export class HomeStudent extends Component {
    state = {loadedTrainingToday: false, loading: true}

    async componentDidMount() {
        await signIn('estudiante123');
        const res = await getUserLoadedTrainingToday()
        this.setState({loadedTrainingToday: res.data.loaded, loading: false})
    }

    render() {
        const {loadedTrainingToday, loading, showSecondModal} = this.state;

        if (loading) {
            return <Loader active/>
        }

        return (
            <Segment basic>
                <ModalEnableNotifications onSubscribed={() => this.setState({showSecondModal: true})}/>
                {
                    showSecondModal && !loadedTrainingToday  &&
                    <ModalHaveTrained/>
                }
            </Segment>
        )
    }
}