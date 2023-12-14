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
        const {state: {MenuHeaderRender}} = this.context
        return (
            <>
                {
                    MenuHeaderRender &&
                    <Segment className={'no-margin top-menu-bar'}>
                        <Header as={'h3'} className={'top-bar'}>
                            {MenuHeaderRender}
                        </Header>
                    </Segment>
                }
            </>
        )
    }
}