import {Component} from "react";
import {withRouter} from "react-router-dom";
import {Grid, Segment} from "semantic-ui-react";
import {AppContext, setData} from "../context";
import { Image } from 'semantic-ui-react'
import schoolWhite from '../icons/school-white-outlined.svg'

class PageOnboarding extends Component {
    static contextType = AppContext

    componentDidMount() {
        this.context.dispatch(setData({secondaryActions: [], fullScreen: true, noMenu: true}))
    }

    render() {
        return (
            <Segment basic={true} className={'onboarding-container'}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <h3 className={'onboarding-header'}>BIENVENID@</h3>
                            <h5 className={'onboarding-subheader'}>AL SISTEMA OPERATIVO DEL ENTRENAMIENTO</h5>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Segment padded={'very'} textAlign={'center'} className={'onboarding-select-instructor'}>
                                <Image src={schoolWhite}/>
                                <p>Instructor</p>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Segment padded={'very'} textAlign={'center'} className={'onboarding-select-instructor'}>
                                <Image src={schoolWhite}/>
                                <p>Instructor</p>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
}

export default withRouter(PageOnboarding);