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
        const {state: {loading, withTopBar, coverImageUrl, noBottomBar, fullScreen, noMenu, secondaryActions, menuButtonSelected, loadCoverImage}} = this.context
        const {children} = this.props;

        let segmentStyle = {
            height: noBottomBar? '100%' : '90%',
            overflowY: 'scroll',
            paddingTop: 20
        }

        if (loadCoverImage) {
            segmentStyle = {
                ...segmentStyle,
                paddingTop: 20,
                marginTop: 0,
                overflowY: 'hidden'
            }
        }

        let containerStyle = {
            height: '100%',
            overflowY: 'scroll',
            overflowX: 'hidden',
            paddingBottom: 80,
            marginTop: 0
        }

        if (fullScreen) {
            segmentStyle = {
                height: '100%',
                overflowY: 'hidden',
                padding: 0,
                margin: 0
            }

            containerStyle = {
                ...containerStyle,
                height: 'unset',
                overflowY: 'hidden',
                overflowX: 'hidden',
            }
        }

        return (
            <>
                <TopMenuBar/>
                <div className={ loadCoverImage ? 'body-app' : ''}
                     style={containerStyle}>
                    {
                        loadCoverImage &&
                        <div className="square-wrapper">
                            <img src={coverImageUrl} alt="cover"/>
                        </div>
                    }
                    <Segment
                        className={loadCoverImage ? '' : 'body-app'}
                         basic style={segmentStyle}>
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