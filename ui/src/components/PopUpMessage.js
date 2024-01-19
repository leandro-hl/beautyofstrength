import {Component} from "react";
import {Message, Popup} from "semantic-ui-react";
import {AppContext, showWarning} from "../context";

export class PopUpMessage extends Component {
    static contextType = AppContext

    render() {
        const {state: {popupMessage: {show, title, description, negative, warning, time}}} = this.context
        return (
            <Popup
                wide
                position={'top center'}
                open={show} basic className={'no-padding'}
                trigger={<div className={'popup-message'} style={{position: 'absolute', width: '100%', bottom: 100}}/>}>
                <Popup.Content>
                    <Message negative={negative} positive={!negative} warning={warning}>
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