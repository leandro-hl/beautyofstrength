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

import {Component} from "react";
import {withRouter} from "react-router-dom";
import {Button, Grid, Loader, Segment} from "semantic-ui-react";
import {AppContext, setData} from "../context";
import { Image } from 'semantic-ui-react'
import {ReactComponent as SchoolIcon} from '../icons/school.svg'
import {ReactComponent as MedalIcon} from '../icons/medal.svg'
import {ReactComponent as FemaleIcon} from '../icons/female.svg'
import {ReactComponent as MaleIcon} from '../icons/male.svg'
import {getUserPermissions, startJourney} from "../service";

class PageOnboarding extends Component {
    static contextType = AppContext
    state = {
        instructorSelected: false,
        athleteSelected: false,
        womenSelected: false,
        menSelected: false,
        renderGenderSelection: false
    }

    componentDidMount() {
        this.context.dispatch(setData({
            secondaryActions: [],
            fullScreen: true,
            noMenu: true
        }))
    }

    async instructorAthleteSelected()  {
        this.setState({renderGenderSelection: true})
    }

    async startJourney(){
        try {
            const {
                instructorSelected,
                athleteSelected,
                womenSelected,
                menSelected
            } = this.state
            if (instructorSelected || athleteSelected) {
                this.setState({startingJourney: true})
                const journeyAs = instructorSelected ? 'instructor' : athleteSelected ? 'athlete' : null
                const gender = womenSelected ? 'f' : menSelected ?'m' : null
                await startJourney({as: journeyAs, gender})
                const b = await getUserPermissions();
                this.context.dispatch(setData({isAuthenticated: true, gender:gender, permissions: b.data, fullScreen: false, noMenu: false}))
                // this.props.history.push(`/bundle?journey=${journeyAs}`)
                this.props.history.push('/my-planifications')
            }
        } catch (error) {
            console.error(error)
        }
    }

    renderGenderSelection = () => {
        const {womenSelected, menSelected, startingJourney} = this.state
        return (
            <Segment basic={true} className={'onboarding-container center-content-vh'}>
                <div>
                    <Grid padded={true}>
                        <Grid.Row>
                            <Grid.Column>
                                <h3 className={'onboarding-header'}>CUENTANOS</h3>
                                <h5 className={'onboarding-subheader'}>UN POCO SOBRE TI</h5>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Segment padded={'very'} textAlign={'center'} vertical={true}
                                         className={`center-content-vh onboarding-select-women ${womenSelected ? 'onboarding-selected' : ''}`}
                                         onClick={() => this.setState({womenSelected: true, menSelected: false})}>
                                    <div>
                                        <FemaleIcon className={'margin-center'}/>
                                        <p>Mujer</p>
                                    </div>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Segment padded={'very'} textAlign={'center'} vertical={true}
                                         className={`center-content-vh onboarding-select-men ${menSelected ? 'onboarding-selected' : ''}`}
                                         onClick={() => this.setState({menSelected: true, womenSelected: false})}>
                                    <div>
                                        <MaleIcon className={'margin-center'}/>
                                        <p>Hombre</p>
                                    </div>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Segment basic padded={'very'} textAlign={'center'}>
                                    {startingJourney && <Loader active/>}
                                    {!startingJourney &&
                                        <Button disabled={!menSelected && !womenSelected}
                                                primary={true}
                                                onClick={() => this.startJourney()}>
                                            Comenzar
                                        </Button>}
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </Segment>
        )
    }

    firstPage = () => {
        const {instructorSelected, athleteSelected, startingJourney} = this.state
        return (
            <Segment basic={true} className={'onboarding-container center-content-vh'}>
                <div>
                    <Grid padded={true}>
                        <Grid.Row>
                            <Grid.Column>
                                <h3 className={'onboarding-header'}>BIENVENIDO!</h3>
                                <h5 className={'onboarding-subheader'}>AL SISTEMA OPERATIVO DEL ENTRENAMIENTO</h5>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Segment padded={'very'} textAlign={'center'} vertical={true}
                                         className={`center-content-vh onboarding-select-instructor ${instructorSelected ? 'onboarding-selected' : ''}`}
                                         onClick={() => this.setState({instructorSelected: true, athleteSelected: false})}>
                                    <div>
                                        <SchoolIcon className={'margin-center'}/>
                                        <p>Instructor</p>
                                    </div>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Segment padded={'very'} textAlign={'center'} vertical={true}
                                         className={`center-content-vh onboarding-select-athlete ${athleteSelected ? 'onboarding-selected' : ''}`}
                                         onClick={() => this.setState({athleteSelected: true, instructorSelected: false})}>
                                    <div>
                                        <MedalIcon className={'margin-center'}/>
                                        <p>Atleta</p>
                                    </div>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Segment basic padded={'very'} textAlign={'center'}>
                                    {startingJourney && <Loader active/>}
                                    {!startingJourney &&
                                        <Button disabled={!athleteSelected && !instructorSelected}
                                                primary={true}
                                                onClick={() => this.instructorAthleteSelected()}>
                                            Comenzar
                                        </Button>}
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </Segment>
        )
    }

    render() {
        const {renderGenderSelection} = this.state
        return (
            <>
                {renderGenderSelection? this.renderGenderSelection() : this.firstPage()}
            </>
        )
    }
}

export default withRouter(PageOnboarding);