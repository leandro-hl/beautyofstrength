import {Component} from "react";
import {withRouter} from "react-router-dom";
import {Button, Grid, Loader, Segment} from "semantic-ui-react";
import {AppContext, setData} from "../context";
import { Image } from 'semantic-ui-react'
import schoolWhite from '../icons/school-white-outlined.svg'
import schoolBlack from '../icons/school-black.svg'
import medalWhite from '../icons/medal-white-outlined.svg'
import medalBlack from '../icons/medal-black.svg'
import {getUserPermissions, startJourney} from "../service";

class PageOnboarding extends Component {
    static contextType = AppContext
    state = {
        instructorSelected: false,
        athleteSelected: false
    }

    componentDidMount() {
        this.context.dispatch(setData({
            secondaryActions: [],
            fullScreen: true,
            noMenu: true
        }))
    }

    async startJourney(){
        try {
            const {instructorSelected, athleteSelected} = this.state
            if (instructorSelected || athleteSelected) {
                this.setState({startingJourney: true})
                const journeyAs = instructorSelected ? 'instructor' : athleteSelected ? 'athlete' : null
                await startJourney({as: journeyAs})
                const b = await getUserPermissions();
                this.context.dispatch(setData({isAuthenticated: true, permissions: b.data, fullScreen: false, noMenu: false}))
                // this.props.history.push(`/bundle?journey=${journeyAs}`)
                this.props.history.push('/my-planifications')
            }
        } catch (error) {
            console.error(error)
        }
    }

    render() {
        const {instructorSelected, athleteSelected, startingJourney} = this.state
        return (
            <Segment basic={true} className={'onboarding-container center-content-vh'}>
                <div>
                    <Grid padded={true}>
                        <Grid.Row>
                            <Grid.Column>
                                <h3 className={'onboarding-header'}>BIENVENID@</h3>
                                <h5 className={'onboarding-subheader'}>AL SISTEMA OPERATIVO DEL ENTRENAMIENTO</h5>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Segment padded={'very'} textAlign={'center'} vertical={true}
                                         className={`center-content-vh onboarding-select-instructor ${instructorSelected ? 'onboarding-selected' : ''}`}
                                         onClick={() => this.setState({instructorSelected: true, athleteSelected: false})}>
                                    <div>
                                        <Image className={'margin-center'} src={instructorSelected ? schoolBlack : schoolWhite}/>
                                        <p>Instructor</p>
                                    </div>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Segment padded={'very'} textAlign={'center'} vertical={true}
                                         className={`center-content-vh onboarding-select-athlete ${athleteSelected ? 'onboarding-selected' : ''}`}
                                         onClick={() => this.setState({athleteSelected: true, instructorSelected: false})}>
                                    <div>
                                        <Image className={'margin-center'} src={athleteSelected ? medalBlack : medalWhite}/>
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
}

export default withRouter(PageOnboarding);