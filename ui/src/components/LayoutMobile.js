import React, {Component} from "react";
import {Advertisement, Segment} from "semantic-ui-react";
import withRouter from "react-router-dom/es/withRouter";
import BottomMenuBar from "./BottomMenuBar";
import {TopMenuBar} from "./TopMenuBar";
import {AppContext, setData} from "../context";
import {MENU} from "../enums";
import {CoverImageEventHandler} from "./CoverImageEventHandler";
import {Tooltip} from "@mui/material";
import {getNextCoverUrl} from "../functions";
import SingleActionMenuBar from "./mui/SingleActionMenuBar";

class LayoutMobile extends Component {
    static contextType = AppContext
    render() {
        const {state: {singleActionMenuBar, loading, withTopBar, coverImageUrl, noBottomBar, fullScreen, noMenu, secondaryActions, menuButtonSelected, loadCoverImage}} = this.context
        const {children} = this.props;

        let segmentStyle = {
            height: '100%',// noBottomBar? '100%' : '90%',
            overflowY: 'scroll',
            paddingTop: 20
        }

        if (loadCoverImage) {
            segmentStyle = {
                ...segmentStyle,
                paddingTop: 20,
                marginTop: 0,
                overflowY: 'unset'
            }
        }

        let containerStyle = {
            height: '100%',
            overflowY: 'scroll',
            overflowX: 'hidden',
            paddingBottom: 120,
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
                <div className={ loadCoverImage ? 'body-app' : 'scrolling-no-scrollbar'}
                     style={containerStyle}>
                    {
                        loadCoverImage &&
                        <>
                            <div className="square-wrapper" style={{
                                background: `
                            linear-gradient(180deg, rgba(18, 18, 18, 0.00) 56.79%, #121212 100%), 
                            url(${coverImageUrl}) lightgray 50% / cover no-repeat`,
                            }}>
                                <span style={{
                                        position: 'absolute',
                                        bottom: '10px',
                                        right: '10px',
                                        color: '#8c8c8c',
                                    fontStyle: 'italic',
                                }}>Atleta: Anonimo</span>
                            </div>
                        </>
                    }
                    <Segment
                        className={loadCoverImage ? '' : 'body-app scrolling-no-scrollbar'}
                        basic style={segmentStyle}>
                        {children}
                        <div style={{paddingTop: '40%'}}></div>
                    </Segment>
                </div>
                {/*{loadCoverImage && <CoverImageEventHandler/>}*/}
                {singleActionMenuBar && <SingleActionMenuBar/>}
                {!noMenu && <BottomMenuBar noBottomBar={noBottomBar} secondaryActions={secondaryActions} selected={menuButtonSelected}
                                onSelected={(val) => this.context.dispatch(setData({menuButtonSelected: val, secondaryActions: []}))}/>}
            </>
        )
    }
}

export default LayoutMobile;