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
class PagePublicHome extends Component {
    static contextType = AppContext
    state = {loading: true}
    componentDidMount() {
        const {state: {auth_token}}=this.context
        if (auth_token) {
            this.props.history.push('/my-planifications')
        }
        this.setState({loading: false})
    }

    render() {
        if (this.state.loading) {
            return <Loader active/>
        }

        const css = `
        body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        background-color: #f4f4f4;
                        height: 100vh;
                    }
                        
                        header {
                        background: #252525;
                        color: #ffffff;
                        padding: 1em;
                        border-bottom: #f9d118 3px solid;
                    }
                        header a {
                        color: #ffffff;
                        text-decoration: none;
                        text-transform: uppercase;
                        font-size: 16px;
                    }
                        header ul {
                        padding: 0;
                        list-style: none;
                        text-align: center;
                    }
                        header ul li {
                        display: inline;
                        padding: 0 20px 0 20px;
                    }
                        .content {
                        padding: 15px;
                    }
                        .content p {
                        font-size: 18px;
                    }
                        footer {
                        padding: 20px;
                        margin-top: 20px;
                        text-align: center;
                        background: #352c2f;
                        color: #ffffff;
                        width: 100%;
                    }`
        return (
            <div>
                <style>{css}</style>
                <header>
                    <div className="container">
                        <h1>bOS, Beauty Of Strength</h1>
                        <nav>
                            <ul>
                                <li><a href="#">Home</a></li>
                                <li><a href="#about">Acerca De Nosotros</a></li>
                                <li><a href="#privacy-policy">Politica de Privacidad</a></li>
                                <li><a href={`${process.env.PUBLIC_URL}/signin`}>Ingresar</a></li>
                            </ul>
                        </nav>
                    </div>
                </header>

                <div className="container">
                    <div className="content">
                        <section id="about">
                            <h2>Acerca De Nosotros</h2>
                            <p>
                                bOS App tiene como objetivo mejorar tu entrenamiento ofreciendo acceso a rutinas y
                                planificaciones creadas por distintos
                                instructores.
                            </p>
                        </section>

                        <section id="privacy-policy">
                            <h2>Compromiso con la Privacidad</h2>
                            <p>
                                En bOS Beauty of Strength, priorizamos tu privacidad. Nuestra Política de Privacidad
                                integral, accesible en cualquier momento bajo la sección “Privacidad” de nuestro sitio
                                web https://bos.team/app/privacy-policies, detalla nuestras prácticas y compromiso con
                                la protección de tus datos personales.
                            </p>
                            <a href={`${process.env.PUBLIC_URL}/privacy-policies`}>Lee nuestra politica de privacidad
                                completa</a>
                        </section>
                    </div>
                </div>

                <footer>
                    <p>© 2023 bOS, Beauty Of Strength. Todos los derechos reservados.</p>
                </footer>
            </div>
        )
    }
}

export default withRouter(PagePublicHome)