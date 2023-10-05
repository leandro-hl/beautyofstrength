import {Component} from "react";
import {Segment} from "semantic-ui-react";
import {ModalHaveTrained} from "./ModalHaveTrained";

export class HomeStudent extends Component {
    render() {
        /*
        El modal se tiene que mostrar COMO MUCHO una vez al dia
         */
        return (
            <Segment basic>
                <ModalHaveTrained/>
            </Segment>
        )
    }
}