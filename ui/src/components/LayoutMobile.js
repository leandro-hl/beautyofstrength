import React, {Component} from "react";
import {Advertisement, Segment} from "semantic-ui-react";
import withRouter from "react-router-dom/es/withRouter";
import BottomMenuBar from "./BottomMenuBar";
import {TopMenuBar} from "./TopMenuBar";
import {AppContext, setData} from "../context";
import {MENU} from "../enums";
import {CoverImageEventHandler} from "./CoverImageEventHandler";

class LayoutMobile extends Component {
    static contextType = AppContext
    render() {
        const {state: {loading, withTopBar, coverImageUrl, noBottomBar, noMenu, secondaryActions, menuButtonSelected, loadCoverImage}} = this.context
        const {children} = this.props;

        const noCoverSegmentStyle = {
            height: noBottomBar? '100%' : '90%',
            overflowY: 'scroll',
            // overflowX: 'hidden',
            paddingTop: 20,
            // paddingBottom: 80,
            // marginTop: 0
        }

        const coverContainerStyle = {
            height: '100%',
            overflowY: 'scroll',
            overflowX: 'hidden',
            paddingBottom: 80,
            marginTop: 0
        }

        const coverSegmentStyle = {
            paddingTop: 20,
            marginTop: 0
        }

        return (
            <>
                <TopMenuBar/>
                <div className={ loadCoverImage ? 'body-app' : ''}
                     style={coverContainerStyle}>
                    {loadCoverImage &&
                        <div className="square-wrapper">
                            <img src={coverImageUrl} alt="cover"/>
                        </div>}
                    <Segment
                        className={loadCoverImage ? '' : 'body-app'}
                         basic style={loadCoverImage ? coverSegmentStyle : noCoverSegmentStyle}>
                        {children}
                        <div style={{marginBottom: 100}}></div>
                    </Segment>
                </div>
                {loadCoverImage && <CoverImageEventHandler/>}
                {!noMenu && <BottomMenuBar noBottomBar={noBottomBar} secondaryActions={secondaryActions} selected={menuButtonSelected}
                                onSelected={(val) => this.context.dispatch(setData({menuButtonSelected: val, secondaryActions: []}))}/>}
            </>
        )
    }
}

export default LayoutMobile;