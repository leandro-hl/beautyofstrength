import React, {Component} from "react";
import {Header, Icon, Loader, Menu, Segment} from "semantic-ui-react";
import {AppContext} from "../context";

export class TopMenuBar extends Component {
    static contextType = AppContext

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        const {state: {MenuHeaderRender, removeMenuHeaderPadding}} = this.context
        return (
            <>
                {
                    MenuHeaderRender &&
                    <Segment className={'no-margin top-menu-bar'+ (removeMenuHeaderPadding ? ' no-padding' : '')}>
                        <Header as={'h3'} className={'top-bar'}>
                            {MenuHeaderRender}
                        </Header>
                    </Segment>
                }
            </>
        )
    }
}