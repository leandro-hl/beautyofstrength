import {Component} from "react";
import {Popup} from "semantic-ui-react";

export class PopUpDisabledAction extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            header: props.disableHeader ?? 'Pasate a Premium!',
            description: props.disableDescription ?? 'Con Premium obtene beneficios y desbloquea todas las funcionalidades'
        }
    }

    handleOpen = () => {
        this.setState({ isOpen: true })

        this.timeout = setTimeout(() => {
            this.setState({ isOpen: false })
        }, 2500)
    }

    handleClose = () => {
        this.setState({ isOpen: false })
        clearTimeout(this.timeout)
    }

    render() {
        return (
            <Popup
                open={this.state.isOpen}
                onClose={() => this.handleClose()}
                onOpen={() => this.handleOpen()}
                trigger={this.props.trigger} on={'click'} position={'top left'}>
                <Popup.Header>{this.state.header}</Popup.Header>
                <Popup.Content>{this.state.description}</Popup.Content>
            </Popup>
        )
    }
}