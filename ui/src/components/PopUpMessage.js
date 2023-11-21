import {Component} from "react";
import {Message, Popup} from "semantic-ui-react";
import {AppContext} from "../context";

export class PopUpMessage extends Component {
    static contextType = AppContext

    render() {
        const {state: {popupMessage: {show, title, description, negative, time}}} = this.context
        return (
            <Popup
                wide
                position={'top center'}
                open={show} basic className={'no-padding'}
                trigger={<div className={'popup-message'} style={{position: 'absolute', width: '100%'}}/>}>
                <Popup.Content>
                    <Message negative={negative} positive={!negative}>
                        <Message.Header>{title}</Message.Header>
                        <Message.Content>
                            {description}
                        </Message.Content>
                    </Message>
                </Popup.Content>
            </Popup>
        )
    }
}