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

import {withRouter} from "react-router-dom";
import {Box, FormControlLabel, Paper, Slider, Typography, Checkbox, Grid, Container} from "@mui/material";
import React,{Component} from "react";
import {TooltipInfoButton} from "./TooltipInfoButton";
import {AppContext, setData} from "../../context";
import {queryParam} from "../../functions";

const LineItem = ({keyId, label, tooltip, price, onChange}) => (
    <Grid container item justifyContent={'space-between'}>
        <Grid item>
            <FormControlLabel control={<Checkbox onChange={(event) => {
                onChange(keyId, event.target.checked, parseInt(price.substring(1, price.length), 10))
            }}/>} label={
                <>
                    {label}
                    <TooltipInfoButton title={tooltip}/>
                </>
            }/>
        </Grid>
        <Grid item>
            <Box height={'100%'} display={'inline-flex'} alignItems={'center'}>{price}</Box>
        </Grid>
    </Grid>
)

class PageBundles extends Component {
    static contextType = AppContext

    state = {loading: true, selectedFeatures: [], total: 0, defaultMessage: 'Elige tus herramientas para continuar'}

    onAction = () => {
        console.log('action')
    }

    componentDidMount() {
        const journey = queryParam(this.props, 'journey')
        this.context.dispatch(setData({
            secondaryActions: [],
            fullScreen: true,
            noMenu: true,
            singleActionMenuBar: {onAction: () => this.onAction(), disable: true, actionTitle: this.state.defaultMessage}
        }))
        this.setState({journey: journey ?? 'instructor', loading:false})
    }

    onChange(keyId, selected, price) {
        const {total, selectedFeatures, defaultMessage}= this.state
        let currentTotal = total
        if (selected) {
            currentTotal += price
            selectedFeatures.push(keyId)
        } else {
            currentTotal -= price
            selectedFeatures.splice(selectedFeatures.indexOf(keyId), 1)
        }
        console.log(selectedFeatures)
        this.setState({total: currentTotal, selectedFeatures})
        const noFeatures = selectedFeatures.length===0
        this.context.dispatch(setData({singleActionMenuBar: {onAction: () => this.onAction(), disable: noFeatures, actionTitle: noFeatures? defaultMessage : `Unirme por $${currentTotal}`}}))
    }

    renderInstructorJourney() {
        return (
            <>
                <h1>Personalizacion</h1>
                <Grid container>
                    <LineItem onChange={(keyId, selected, price) => this.onChange(keyId, selected, price)}
                        keyId={'uploadAppLogo'}
                        label={'Subi tu propio Logo'}
                        tooltip={'Obten un codigo de creador y permite que tus atletas descarguen la aplicacion con tu logo'}
                        price={'$50'}
                    />
                    <LineItem onChange={(keyId, selected, price) => this.onChange(keyId, selected, price)}
                        keyId={'changeAppName'}
                        label={'Elegi el nombre de la app'}
                        tooltip={'Obten un codigo de creador y configura como se ve la App en la pantalla de Inicio del celular de tus atletas'}
                        price={'$50'}
                    />
                    <LineItem onChange={(keyId, selected, price) => this.onChange(keyId, selected, price)}
                        keyId={'changeAppColors'}
                        label={'Eligi tus propios colores'}
                        tooltip={'Para los botones tanto en light mode como en dark mode'}
                        price={'$50'}
                    />
                    <LineItem onChange={(keyId, selected, price) => this.onChange(keyId, selected, price)}
                        keyId={'uploadCoverImageToRoutine'}
                        label={'Agrega foto de portada hasta a 100 rutinas'}
                        tooltip={'Dale mas vida a tus rutinas con una foto de portada propia'}
                        price={'$200'}
                    />
                    <LineItem onChange={(keyId, selected, price) => this.onChange(keyId, selected, price)}
                        keyId={'uploadExerciseVideos'}
                        label={'Subi hasta 100 videos de ejercicios'}
                        tooltip={'Agrega videos de hasta 10 segundos a cada ejercicio y personaliza la experiencia de tus atletas'}
                        price={'$500'}
                    />
                    <LineItem onChange={(keyId, selected, price) => this.onChange(keyId, selected, price)}
                        keyId={'uploadExerciseVideoLinks'}
                        label={'Subi sin limite links de YouTube Shorts'}
                        tooltip={'Agrega links a cada ejercicio y personaliza la experiencia de tus atletas'}
                        price={'$100'}
                    />
                </Grid>

                <h1>Datos</h1>
                <Grid container>
                    {/*todo: definir que ejercicios entran en este pack y cuantos son. Ver stories de data*/}
                    <LineItem onChange={(keyId, selected, price) => this.onChange(keyId, selected, price)}
                        keyId={'basicExercisesPack'}
                        label={'Pack de ejercicios basico'}
                        tooltip={'200 ejercicios de gimnasio. Con grupos musculares y equipo asociado'}
                        price={'$200'}
                    />
                    {/*todo: clasificacion por deporte. Otras clasificaciones?*/}
                    <LineItem onChange={(keyId, selected, price) => this.onChange(keyId, selected, price)}
                        keyId={'premiumExercisesPack'}
                        label={'Pack de ejercicios premium'}
                        tooltip={'200 ejercicios de gimnasio. Con grupos musculares y equipo asociado'}
                        price={'$200'}
                    />
                    <LineItem onChange={(keyId, selected, price) => this.onChange(keyId, selected, price)}
                        keyId={'createYourOwnExercises'}
                        label={'Crea tus propios ejercicios'}
                        tooltip={'Crea hasta 500 ejercicios propios y personaliza aun mas tus rutinas'}
                        price={'$300'}
                    />
                    <LineItem onChange={(keyId, selected, price) => this.onChange(keyId, selected, price)}
                        keyId={'createUpTo100Routines'}
                        label={'Crea hasta 100 rutinas'}
                        tooltip={'Tus rutinas siempre en la nube'}
                        price={'$50'}
                    />
                    <LineItem onChange={(keyId, selected, price) => this.onChange(keyId, selected, price)}
                        keyId={'shareWithUpTo100Athletes'}
                        label={'Asocia tu perfil hasta con 100 atletas'}
                        tooltip={'Comparte tu codigo personal hasta con 100 atletas'}
                        price={'$50'}
                    />
                    <LineItem onChange={(keyId, selected, price) => this.onChange(keyId, selected, price)}
                        keyId={'createUpTo100Planifications'}
                        label={'Crea hasta 100 planificaciones'}
                        tooltip={'Para agrupar rutinas o compartir con atletas'}
                        price={'$50'}
                    />
                </Grid>

                <h1>Mis Atletas</h1>
                <Grid container>
                    <LineItem onChange={(keyId, selected, price) => this.onChange(keyId, selected, price)}
                        keyId={'myAthletesCanExecuteMyRoutines'}
                        label={'Ejecutar rutina'}
                        tooltip={'Permite a tus atletas ejecutar tus rutinas con timer e historico de ejercicios'}
                        price={'$500'}
                    />
                </Grid>
            </>
        )
    }

    render() {
        const {journey} = this.state;

        return (
            <Container className={'onboarding-container'}>
                <Box pt={4}>
                    {journey === 'instructor'? this.renderInstructorJourney() : null}
                </Box>
            </Container>
        )
    }
}

export default withRouter(PageBundles);