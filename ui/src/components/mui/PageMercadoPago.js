import {Component} from "react";
import {setupMercadoPago} from "../../integrations";

export class PageMercadoPago extends Component {
    async componentDidMount() {
        await setupMercadoPago()
    }

    render() {
        return (
            <>
                <div id="paymentBrick_container">
                </div>
            </>
        )
    }
}