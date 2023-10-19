import React, {Component} from "react";
import {Segment} from "semantic-ui-react";
import withRouter from "react-router-dom/es/withRouter";
import BottomMenuBar from "./BottomMenuBar";
import {TopMenuBar} from "./TopMenuBar";
import {AppContext} from "../context";

class LayoutMobile extends Component {
    static contextType = AppContext
    state = {selected: 'home'}
    render() {
        const {state: {loading, withTopBar, noBottomBar, noMenu, secondaryActions}} = this.context
        const {children} = this.props;
        const {selected} = this.state

        return (
            <>
                {withTopBar && <TopMenuBar/>}
                <Segment basic style={{
                    height: noBottomBar? '92%' : '85%',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    paddingTop: 20
                }}>
                    {children}
                </Segment>
                {!noMenu && <BottomMenuBar noBottomBar={noBottomBar} secondaryActions={secondaryActions} selected={selected}
                                onSelected={(val) => this.setState({selected: val})}/>}
            </>
        )
    }
}

export default LayoutMobile;