import React, {Component} from "react";
import {Button, Modal, Segment} from "semantic-ui-react";
import {retrieveVapidPublicKey, saveUserDevicePushNotificationSubscription} from "../service";
import {urlBase64ToUint8Array} from "../functions";

export class ModalEnableNotifications extends Component {
    state = { showModal: false }

    componentDidMount() {
        if (Notification.permission !== "granted") {
            this.setState({ showModal: true });
        } else {
            this.subscribeToPushNotifications()
        }
    }

    async subscribeToPushNotifications() {
        // Use the PushManager to get the user's subscription to the push service.
        const registration = await navigator.serviceWorker.getRegistration(`${process.env.PUBLIC_URL}/service-worker.js`)
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            // Get the server's public key
            const response = await retrieveVapidPublicKey();
            const vapidPublicKey = response.data;

            // Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet
            const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

            // userVisibleOnly allows to specify that we don't plan to
            // send notifications that don't have a visible effect for the user).
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            });
        }
        await saveUserDevicePushNotificationSubscription({subscription: JSON.stringify(subscription)})
        console.log("push subscription saved.")
        this.props.onSubscribed()
    }

    async requestPermission() {
        const result = await Notification.requestPermission();
        if (result === "granted") {
            this.subscribeToPushNotifications()
        }
    }

    async handleConfirm() {
        await this.requestPermission()
        this.handleClose();
    }

    handleClose = () => {
        this.setState({ showModal: false });
    }

    render() {
        return (
            <Modal dimmer={'blurring'} size="mini" open={this.state.showModal} onClose={() => this.handleClose()}>
                <Modal.Header>Habilitar Notificaciones</Modal.Header>
                <Modal.Content>
                    <p>No te pierdas todas las nuevas rutinas y cambios que suba [NOMBRE_ENTRENADOR]</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button secondary onClick={() => this.handleClose()}>Cancelar</Button>
                    <Button primary onClick={() => this.handleConfirm()}>Activar Notificaciones</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}