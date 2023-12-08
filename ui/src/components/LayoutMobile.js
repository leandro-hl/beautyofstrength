import React, {Component} from "react";
import {Advertisement, Segment} from "semantic-ui-react";
import withRouter from "react-router-dom/es/withRouter";
import BottomMenuBar from "./BottomMenuBar";
import {TopMenuBar} from "./TopMenuBar";
import {AppContext, setData} from "../context";
import {MENU} from "../enums";

class LayoutMobile extends Component {
    static contextType = AppContext
    render() {
        const {state: {loading, withTopBar, noBottomBar, noMenu, secondaryActions, menuButtonSelected}} = this.context
        const {children} = this.props;

        return (
            <>
                <TopMenuBar/>
                <Segment basic style={{
                    height: noBottomBar? '100%' : '90%',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    paddingTop: 20,
                    paddingBottom: 80,
                    marginTop: 0
                }}>
                    {children}
                    <div style={{marginBottom: 100}}></div>
                </Segment>
                {!noMenu && <BottomMenuBar noBottomBar={noBottomBar} secondaryActions={secondaryActions} selected={menuButtonSelected}
                                onSelected={(val) => this.context.dispatch(setData({menuButtonSelected: val, secondaryActions: []}))}/>}
            </>
        )
    }
}

export default LayoutMobile;