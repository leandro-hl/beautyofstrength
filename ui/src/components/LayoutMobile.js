import React, {Component} from "react";
import {Segment} from "semantic-ui-react";
import withRouter from "react-router-dom/es/withRouter";
import BottomMenuBar from "./BottomMenuBar";
import {TopMenuBar} from "./TopMenuBar";

class LayoutMobile extends Component {
    render() {
        const {children, loading, withTopBar, noBottomBar} = this.props;
        return (
            <>
                {withTopBar && <TopMenuBar/>}
                <Segment basic style={{
                    height: noBottomBar? '100%' : '90%',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    paddingTop: 20
                }}>
                    {children}
                </Segment>
                {!noBottomBar && <BottomMenuBar/>}
            </>
        )
    }
}

export default withRouter(LayoutMobile);