/**
 * Copyright 2025 Leandro Herenu - BOS (Beauty Of Strength)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {getLocalInfo} from "../service";
import axios from "axios";
import {AppContext, setData} from "../context";
import {Loader} from "semantic-ui-react";

export const Banner = ({signIn}) => {
    return (
        <div className="banner">
            <div className="titulos">
                <div className="TITULOS">
                    <div className="text-wrapper">ALCANZA</div>
                    <div className="div">TUS METAS FITNESS</div>
                </div>
                <p className="POTENCIAMOS-a-LOS">
                    <span className="span">🏋️‍♂️ </span>
                    <span className="text-wrapper-2">POTENCIAMOS A LOS INSTRUCTORES</span>
                    <span className="span">
            {" "}
                        PARA EXPANDIR SU NEGOCIO <br /> <br />
            🤝{" "}
          </span>
                    <span className="text-wrapper-2">CONÉCTATE CON TU COMUNIDAD</span>
                    <span className="span">
            {" "}
                        DE ALUMNOS EN INSTANTES <br /> <br />✅{" "}
          </span>
                    <span className="text-wrapper-2">PROGRAMA Y GESTIONA</span>
                    <span className="span">
            {" "}
                        TUS ENTRENAMIENTOS EFICIENTEMENTE <br /> <br />
            🚀{" "}
          </span>
                    <span className="text-wrapper-2">AYUDAMOS A LOS ATLETAS</span>
                    <span className="span">
            {" "}
                        A OPTIMIZAR SU CRECIMIENTO FÍSICO <br /> <br />
            📈{" "}
          </span>
                    <span className="text-wrapper-2">REALIZA UN SEGUIMIENTO</span>
                    <span className="span"> DE TODO TU PROGRESO</span>
                </p>
            </div>
            <div className="banner-suscripcion">
                {/*<div className="text-field">*/}
                {/*    <div className="content">*/}
                {/*        <div className="input">*/}
                {/*            <input className="label" placeholder="Ingresa tu email..." type="email" />*/}
                {/*        </div>*/}
                {/*        <img className="underline" alt="Underline" src="underline.svg" />*/}
                {/*    </div>*/}
                {/*</div>*/}
                <button className="button" onClick={()=>signIn()}>
                    <div className="base">
                        <button className="button-2">Quiero Ser Élite 🔥</button>
                    </div>
                </button>
            </div>
        </div>
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