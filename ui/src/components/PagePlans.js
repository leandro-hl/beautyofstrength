import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import {Button, Card, Grid, Header, Icon, List, Segment, Table} from "semantic-ui-react";
import {AppContext, setData} from "../context";
import {contactByWhatsapp} from "../functions";

const MenuHeaderRender = ({onBackArrow}) => {
    return (
        <>
            <Button className={'header-back-arrow'} icon onClick={() => onBackArrow()}>
                <Icon name={'arrow left'}/>
            </Button>
            Planes Para Atletas
        </>)
}

class PagePlans extends Component {
    static contextType = AppContext
    state = {loading: true, plans: [], mlEnabled: false}
    async componentDidMount() {
        try {
            this.context.dispatch(setData({
                noBottomBar: true,
                secondaryActions: [],
                MenuHeaderRender: <MenuHeaderRender onBackArrow={() => this.props.history.goBack()}/>,
            }))

            if (this.state.mlEnabled) {
                this.loadMercadoPagoSDK()
            }
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

    contactByWhatsapp(type) {
        contactByWhatsapp(type)
        this.props.history.push('/my-planifications')
    }

    plansV1() {
        const {mlEnabled} = this.state
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
                                        <List>
                                            <List.Item>
                                                <List.Icon name='angle right' />
                                                <List.Content>
                                                    <List.Header>Atleta Élite +</List.Header>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Icon name='angle right' />
                                                <List.Content>
                                                    <List.Header>Soporte preferencial</List.Header>
                                                    <List.Description>
                                                        Queremos que tu sueño crezca y solucionar tus problemas
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Icon name='angle right' />
                                                <List.Content>
                                                    <List.Header>Partnership</List.Header>
                                                    <List.Description>
                                                        Trabajemos juntos, comunicate con nosotros
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Icon name='angle right' />
                                                <List.Content>
                                                    <List.Header>Actualizaciones</List.Header>
                                                    <List.Description>
                                                        Nuevas funcionalidades todas las semanas
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Icon name='angle right' />
                                                <List.Content>
                                                    <List.Header>Administracion</List.Header>
                                                    <List.Description>
                                                        Crea y maneja múltiples planificaciones
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Icon name='angle right' />
                                                <List.Content>
                                                    <List.Header>Vende</List.Header>
                                                    <List.Description>
                                                        Comparte planificaciones enteras con Atletas o en tu gimnasio
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                        </List>
                                        <Button primary fluid onClick={() => this.contactByWhatsapp('instructor')}><b>Me Interesa <Icon name={'whatsapp'}/></b></Button>
                                        {mlEnabled &&
                                            <a href="https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848b84cc99018b95a687fd1136"
                                               name="MP-payButton">Suscribirme</a>}
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
                                        <List>
                                            <List.Item>
                                                <List.Icon name='angle right' />
                                                <List.Content>
                                                    <List.Header>Soporte</List.Header>
                                                    <List.Description>
                                                        Tenes una idea o problema? Nosotros hacemos realidad la solucion
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Icon name='angle right' />
                                                <List.Content>
                                                    <List.Header>Actualizaciones</List.Header>
                                                    <List.Description>
                                                        Nuevas funcionalidades todas las semanas
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Icon name='angle right' />
                                                <List.Content>
                                                    <List.Header>Tus rutinas en la nube</List.Header>
                                                    <List.Description>
                                                        Ya no pierdas acceso a las rutinas que te llevaron tanto esfuerzo recolectar
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Icon name='angle right' />
                                                <List.Content>
                                                    <List.Header>Planificacion semanal</List.Header>
                                                    <List.Description>
                                                        Asigna un dia especifico a cada una de tus rutinas
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Icon name='angle right' />
                                                <List.Content>
                                                    <List.Header>Rutinas complejas</List.Header>
                                                    <List.Description>
                                                        Crea rutinas con varios bloques de ejercicios de distintos tipos
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Icon name='angle right' />
                                                <List.Content>
                                                    <List.Header>Lo que quieras</List.Header>
                                                    <List.Description>
                                                        AMRAP, Circuitos Por Intervalos, Combos, Pirámides, Repeticiones: disponibles para elegir y más en camino
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Icon name='angle right' />
                                                <List.Content>
                                                    <List.Header>Timer</List.Header>
                                                    <List.Description>
                                                        Ejecutá tus rutinas en tiempo real
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Icon name='angle right' />
                                                <List.Content>
                                                    <List.Header>Vas al parque con amigos?</List.Header>
                                                    <List.Description>
                                                        Crea y comparte rutinas con ellos
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Icon name='angle right' />
                                                <List.Content>
                                                    <List.Header>Estadísticas</List.Header>
                                                    <List.Description>
                                                        En camino. Estamos trabajando arduamente para hacerlas llegar a tus manos
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item>
                                                <List.Icon name='angle right' />
                                                <List.Content>
                                                    <List.Header>Planificaciones</List.Header>
                                                    <List.Description>
                                                        Un instructor compartió una planificación con vos? Accede al detalle de la semana completa
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                        </List>
                                        <Button primary fluid onClick={() => this.contactByWhatsapp('athlete')}><b>Me Interesa <Icon name={'whatsapp'}/></b></Button>
                                        {
                                            mlEnabled &&
                                            <a href="https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848b84cc76018b95b20f44115a"
                                               name="MP-payButton">Suscribirme</a>}
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

    plansData() {
        return [
            {
                feature: 'Solicitar Acceso A Planificacion Compartida',
                initial: true,
                elite: true
            },
            {
                feature: 'Ver Rutina Compartida',
                initial: true,
                elite: true
            },
            {
                feature: 'Ver Videos De Ejercicios',
                initial: true,
                elite: true
            },
            {
                feature: 'Compartir Rutina',
                initial: true,
                elite: true
            },
            {
                feature: 'Dark Mode',
                initial: true,
                elite: true
            },
            {
                feature: 'Cargar Mi Equipamiento',
                initial: true,
                elite: true
            },
            {
                feature: 'Crear Sus Propias Rutinas',
                initial: 'Una Rutina',
                elite: 'Todas Las Que Quiera'
            },
            {
                feature: 'Ver Rutinas De Planificacion Compartida',
                initial: 'Una Rutina',
                elite: 'Semana Completa'
            },
            {
                feature: 'Marcar Rutina Como Completada U Omitida En Planificacion',
                initial: false,//'Una por dia',
                elite: true
            },
            {
                feature: 'Ejecutar Rutina',
                initial: false,
                elite: true
            },
            {
                feature: 'Ingreso de Pesos en Rutina',
                initial: false,
                elite: true
            },
            {
                feature: 'Timer Rutina',
                initial: false,
                elite: true
            },
            {
                feature: 'Borg Escala Esfuerzo Percibido',
                initial: false,
                elite: true
            },
            {
                feature: 'Historial de Ejercicios',
                initial: false,
                elite: true
            },
            {
                feature: 'Guardar Rutinas Compartidas',
                initial: false,
                elite: true
            },
            {
                feature: 'Editar Planificacion Personal (Mi Planificacion)',
                initial: false,
                elite: true
            },
            {
                feature: 'Editar Rutina',
                initial: false,
                elite: true
            },
            {
                feature: 'Agregar Bloques O Trabajos A Rutina',
                initial: false,
                elite: true
            },
            {
                feature: 'Track de RMs',
                initial: false,
                elite: true
            }
        ]
    }

    plansV2() {
        const data = this.plansData()
        return (
            <>
                <Segment style={{width: '100%'}} className={'no-left-padding no-right-padding'}>
                    <Table basic textAlign={'center'} unstackable style={{border: 'unset'}}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Feature</Table.HeaderCell>
                                <Table.HeaderCell>Inicial</Table.HeaderCell>
                                <Table.HeaderCell>Elite</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {data.map((u, j) => {
                                return (
                                    <Table.Row key={j} className={'table-row-item'}>
                                        <Table.Cell style={{textAlign: 'left'}}>
                                            {u.feature}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {typeof(u.initial) === 'string' ? u.initial : u.initial ? 'SI' : 'NO'}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {typeof(u.elite) === 'string' ? u.elite : u.elite ? 'SI' : 'NO'}
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>
                </Segment>
            </>
        )
    }

    render() {
        return this.plansV2()
    }
}

export default withRouter(PagePlans);