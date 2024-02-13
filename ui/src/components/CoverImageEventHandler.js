import React, {Component} from "react";
import {Segment} from "semantic-ui-react";
import {AppContext} from "../context";

export class CoverImageEventHandler extends Component {
    componentDidMount() {
        const body = document.getElementsByClassName('body-app')[0];
        body.onscroll = function() {
            if (body.scrollTop === 0) {
                const header = document.getElementsByClassName('top-bar-absolute')[0];
                header?.classList?.add('transparent')
            } else {
                const header = document.getElementsByClassName('top-bar-absolute')[0];
                header?.classList?.remove('transparent')
            }
        };
    }

    componentWillUnmount() {
        const body = document.getElementsByClassName('body-app')[0];
        body.onscroll = null
    }

    render() {
        return null
    }
}