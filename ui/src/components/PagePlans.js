import {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import {Card, Grid, Header} from "semantic-ui-react";
import {AppContext, setData} from "../context";

class PagePlans extends Component {
    static contextType = AppContext
    state = {loading: true, plans: []}
    async componentDidMount() {
        try {
            this.context.dispatch(setData({
                noBottomBar: true,
                secondaryActions: []
            }))
            this.loadMercadoPagoSDK()
        } catch (e) {
            console.error(e)
        }
    }

    loadMercadoPagoSDK() {
        if (window.$MPC_loaded !== true) {
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = document.location.protocol + "//secure.mlstatic.com/mptools/render.js";
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
            window.$MPC_loaded = true;
        }
        //window.$MPC_loaded !== true ? (window.attachEvent ? window.attachEvent('onload', $MPC_load) : window.addEventListener('load', $MPC_load, false)) : null;
        /*
        // to receive event with message when closing modal
        from congrants back to site function
        $MPC_message(event) {
        // onclose modal ->CALLBACK FUNCTION
        // !!!!!!!!FUNCTION_CALLBACK HERE Received message:
        {event.data} preapproval_id !!!!!!!!
        }
        window.$MPC_loaded !== true ?
        (window.addEventListener("message", $MPC_message)) : null;         */
    }

    render() {
        return (
            <>
                <Header as={'h3'}/>
                <Grid>
                    <Grid.Column>
                        <Grid.Row style={{paddingBottom: '1em'}}>
                            Creemos la mejor Aplicacion de Calistenia, juntos.
                        </Grid.Row>
                        <Grid.Row style={{paddingBottom: '1em'}}>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header>Atleta Élite Instructor</Card.Header>
                                    <Card.Meta>Manejas mas de una planificacion o la compartis con varias personas</Card.Meta>
                                    <Card.Description>
                                        <a href="https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848b84cc99018b95a687fd1136"
                                           name="MP-payButton">Suscribirme</a>
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        </Grid.Row>
                        <Grid.Row>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header>Atleta Élite</Card.Header>
                                    <Card.Meta>Estadisticas y seguimiento</Card.Meta>
                                    <Card.Description>
                                        <a href="https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848b84cc76018b95b20f44115a"
                                           name="MP-payButton">Suscribirme</a>
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        </Grid.Row>
                        <Grid.Row style={{textAlign: 'center', padding: '1em'}}>
                            <Link to={'/my-planifications'}>Continuar de forma gratuita</Link>
                        </Grid.Row>
                    </Grid.Column>
                </Grid>
            </>
        )
    }
}

export default withRouter(PagePlans);