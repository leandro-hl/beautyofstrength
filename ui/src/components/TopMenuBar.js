import React, {Component} from "react";
import {Header, Icon, Loader, Menu, Segment} from "semantic-ui-react";
import {AppContext} from "../context";

export class TopMenuBar extends Component {
    static contextType = AppContext

    render() {
        const {state: {MenuHeaderRender, removeMenuHeaderPadding, coverImageUrl}} = this.context
        return (
            <>
                {
                    MenuHeaderRender &&
                    <Segment
                        style={{width: '100%', zIndex: 100}}
                        className={'no-margin'
                            + (removeMenuHeaderPadding ? ' no-padding' : '')
                            + (coverImageUrl ? ' transparent top-bar-absolute': ' top-menu-bar')}>
                        <Header as={'h3'} className={'top-bar'}>
                            {MenuHeaderRender}
                        </Header>
                    </Segment>
                }
            </>
        )
    }
}