import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {getLocalInfo} from "../service";
import axios from "axios";
import {AppContext, setData} from "../context";
import {Loader} from "semantic-ui-react";
import {Button, Grid, Paper, TextField, Typography} from "@mui/material";

export const Banner = ({signIn}) => {
    const widthMain=10;
    const widthSecondary=1;
    return (
        <Grid container className={'full-height'}>
            <Grid item container xs={widthSecondary} sm={widthSecondary} md={widthSecondary} lg={widthSecondary} xl={widthSecondary}></Grid>
            <Grid item container xs={widthMain} sm={widthMain} md={widthMain} lg={widthMain} xl={widthMain}
                  flexWrap={'nowrap'} alignItems={'center'}>
                <Grid item container flexDirection={'column'}>
                    <Typography variant={'homeh1'} className={'home-banner-title'} >
                        ALCANZA
                    </Typography>
                    <Typography>
                        TUS METAS FITNESS
                    </Typography>
                    <p>
                        🏋️‍♂️ POTENCIAMOS A LOS INSTRUCTORES PARA EXPANDIR SU NEGOCIO<br/>

                        🤝 CONÉCTATE CON TU COMUNIDAD DE ALUMNOS EN INSTANTES<br/>

                        ✅ PROGRAMA Y GESTIONA TUS ENTRENAMIENTOS EFICIENTEMENTE<br/>

                        🚀 AYUDAMOS A LOS ATLETAS A OPTIMIZAR SU CRECIMIENTO FÍSICO<br/>

                        📈 REALIZA UN SEGUIMIENTO DE TODO TU PROGRESO<br/>
                    </p>
                </Grid>
                <Grid item container justifyContent={'center'}>
                    <Paper sx={{padding:'20px'}}>
                        <Grid item container flexDirection={'column'} >
                            <TextField label="Email" variant="outlined" placeholder={'Ingrese su email'} className={'margin-bottom-1'} />
                            <Button className={'padding-1'} className={'margin-bottom-1'}>
                                Quiero ser Élite 🔥
                            </Button>
                            <Typography>
                                Si ya tienes una cuenta te iniciaremos sesión
                            </Typography>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Grid item container  xs={widthSecondary} sm={widthSecondary} md={widthSecondary} lg={widthSecondary} xl={widthSecondary}></Grid>
        </Grid>
    );
};

export const About = ({signIn}) => {
    return (
        <div className="sobre-la-app">
            <div className="TITULO">
                <div className="text-wrapper">SOBRE LA APP</div>
                <p className="div">TODO LO QUE PUEDES HACER</p>
            </div>
            <div className="elementos">
                <img className="rectangle" alt="Rectangle" src="landing-about.png" />
                <div className="textos">
                    <div className="TEXTOS">
                        <div className="div-2">
                            <div className="text-wrapper-2">CREA</div>
                            <p className="p">
                                Crea rutinas y planificaciones
                            </p>
                        </div>
                        <div className="div-2">
                            <div className="text-wrapper-2">PLANIFICA</div>
                            <p className="p">
                                Crea planificaciones acorde a tus necesidades
                            </p>
                        </div>
                        <div className="div-2">
                            <div className="text-wrapper-2">COMPARTE</div>
                            <p className="p">
                                Comparte rutinas con amigos
                            </p>
                        </div>
                    </div>
                    <button className="button" onClick={()=>signIn()}>
                        <div className="base">
                            <button className="button-2">Abrir La App</button>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

const Footer = () => {
    return (
        <div className="Footer" style={{
            // width: 360,
            height: 372.50,
            paddingTop: 40,
            paddingBottom: 80,
            paddingLeft: 18,
            paddingRight: 18,
            borderTop: '0.83px solid',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 40,
            display: 'inline-flex'
        }}>
            <div className="InfoFooter" style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: 16,
                display: 'flex'
            }}>
                <div className="Logo"
                     style={{justifyContent: 'flex-start', alignItems: 'center', gap: 4.47, display: 'inline-flex'}}>
                    <div className="Group16" style={{width: 67.50, height: 67.50, position: 'relative'}}>
                        <div className="Ellipse5" style={{
                            width: 67.50,
                            height: 67.50,
                            left: 0,
                            top: 0,
                            position: 'absolute',
                            background: '#212121',
                            borderRadius: 9999,
                            backgroundImage: "url('logo64.png')",
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'contain'
                        }}/>
                        <div className="Vector"
                             style={{width: 47.70, height: 56.58, left: 9.80, top: 5.06, position: 'absolute'}}></div>
                    </div>
                    <div className="BeautyOfStrength" style={{
                        color: 'white',
                        fontSize: 14,
                        fontFamily: 'Rubik',
                        fontWeight: '900',
                        wordWrap: 'break-word'
                    }}>Beauty Of Strength
                    </div>
                </div>
            </div>
            <div className="Frame427318971" style={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: 40,
                display: 'flex'
            }}>
                <div className="Frame427318909" style={{
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: 6.67,
                    display: 'flex'
                }}>
                    <div className="Frame427318970" style={{
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        gap: 5,
                        display: 'flex'
                    }}>
                        <div className="TRminosYCondiciones" style={{
                            width: 322.88,
                            color: 'white',
                            fontSize: 14,
                            fontFamily: 'Open Sans',
                            fontWeight: '600',
                            wordWrap: 'break-word'
                        }}>
                            <a href={`${process.env.PUBLIC_URL}/terms`}>
                                Términos y condiciones
                            </a>
                        </div>
                        <div className="PolTicaDePrivacidad" style={{
                            width: 294.75,
                            color: 'white',
                            fontSize: 14,
                            fontFamily: 'Open Sans',
                            fontWeight: '600',
                            wordWrap: 'break-word'
                        }}>
                            <a href={`${process.env.PUBLIC_URL}/privacy-policies`}>
                            Política de privacidad
                            </a>
                        </div>
                    </div>
                </div>
                <div className="CopyrightBosTeamTodosLosDerechosReservados2024" style={{
                    width: 275.62,
                    color: 'white',
                    fontSize: 14,
                    fontFamily: 'Open Sans',
                    fontWeight: '400',
                    wordWrap: 'break-word'
                }}>Copyright © bOS Team - <br/>Todos los derechos reservados 2024
                </div>
            </div>
        </div>
    )
}

class PagePublicHomeV2 extends Component {
    static contextType = AppContext
    state = {loading: true}

    componentDidMount() {
        const {state: {auth_token}} = this.context
        if (auth_token) {
            this.props.history.push('/my-planifications')
        }
        this.context.dispatch(setData({fullScreen: true, noBottomBar: true, noMenu: true}))
        this.setState({loading: false})
    }

    signIn() {
        this.props.history.push(`/signin`)
    }

    render() {
        if (this.state.loading) {
            return <Loader active/>
        }

        return (
            <div style={{overflowY: 'scroll', height: '100vh'}}>
                <Banner signIn={() => this.signIn()}/>
                <About signIn={() => this.signIn()}/>
                <Footer/>
            </div>
        )
    }
}

export default withRouter(PagePublicHomeV2)