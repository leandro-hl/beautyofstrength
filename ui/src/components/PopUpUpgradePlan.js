import {Component} from "react";
import {Popup} from "semantic-ui-react";

export class PopUpUpgradePlan extends Component {
    state = { isOpen: false }

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
                <Popup.Header>Pasate a Premium!</Popup.Header>
                <Popup.Content>Con Premium obtene beneficios y desbloquea todas las funcionalidades</Popup.Content>
            </Popup>
        )
    }
}