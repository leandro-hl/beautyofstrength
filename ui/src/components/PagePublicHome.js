import React, {Component} from "react";
import {withRouter} from "react-router-dom";
class PagePublicHome extends Component {
    render() {
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
                        min-height: 70px;
                        height: 160px;
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
                        position: absolute;
                        width: 100%;
                        bottom: 0;
                    }`
        return (
            <div>
                <style>{css}</style>
                <header>
                    <div className="container">
                        <h1>bOS, Beauty Of Strenght</h1>
                        <nav>
                            <ul>
                                <li><a href="#">Home</a></li>
                                <li><a href="#about">Acerca De Nosotros</a></li>
                                <li><a href="#privacy-policy">Politica de Privacidad</a></li>
                                <li><a href="https://bos.team/app/signin" target="_blank">Ingresar</a></li>
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
                            <a href="https://bos.team/app/privacy-policies">Lee nuestra politica de privacidad
                                completa</a>
                        </section>
                    </div>
                </div>

                <footer>
                    <p>© 2023 bOS, Beauty Of Strenght. Todos los derechos reservados.</p>
                </footer>
            </div>
        )
    }
}

export default withRouter(PagePublicHome)