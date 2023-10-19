import React, {Component} from "react";
import {Loader, Segment} from "semantic-ui-react";
import {ModalHaveTrained} from "./ModalHaveTrained";
import {getUserLoadedTrainingToday, signIn} from "../service";
import {ModalEnableNotifications} from "./ModalEnableNotifications";
import {withRouter} from "react-router-dom";
import LayoutMobile from "./LayoutMobile";
import {AppContext, setData} from "../context";

class PageHomeStudent extends Component {
    static contextType = AppContext
    state = {loadedTrainingToday: false, loading: true}

    async componentDidMount() {
        try {
            this.context.dispatch(setData({noBottomBar: false}))
            const res = await getUserLoadedTrainingToday()
            this.setState({loadedTrainingToday: res.data.loaded, loading: false})
        } catch (e) {
            console.error(e)
        } finally {
            this.setState({loading: false})
        }
    }

    render() {
        const {loadedTrainingToday, loading, showSecondModal} = this.state;

        if (loading) {
            return <Loader active/>
        }

        return (
            <>
                <ModalEnableNotifications onSubscribed={() => this.setState({showSecondModal: true})}/>
                {
                    showSecondModal && !loadedTrainingToday  &&
                    <ModalHaveTrained/>
                }
            </>
        )
    }
}

export default withRouter(PageHomeStudent);