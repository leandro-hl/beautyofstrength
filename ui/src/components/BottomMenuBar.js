import React, {Component} from "react";
import {Button, Icon} from "semantic-ui-react";
import {withRouter} from "react-router-dom";
import {AppContext} from "../context";
import {MENU} from "../enums";
import {PopUpUpgradePlan} from "./PopUpUpgradePlan";

class BottomMenuBar extends Component {
    static contextType = AppContext
    constructor(props) {
        super(props);
        this.state = {}
    }

    onClick(name, redirect) {
        const {selected} = this.props

        if (selected !== name) {
            this.props.onSelected(name)
        }
        this.props.history.push(redirect)
    }

    render() {
        const {state: {permissions: {
            menuhomeprofessor,
            menuhomestudent,
            menuplanifications,
            menudiscussions,
            menustatistics
        }}} = this.context
        const {selected, secondaryActions, noBottomBar} = this.props
        return (
            <div style={{position: 'absolute', bottom: 0, width: '100%', maxWidth: 600}}>
                {
                    secondaryActions && secondaryActions.length == 2 &&
                    <Button.Group fluid>
                        <Button secondary onClick={() => secondaryActions[0].func()}>{secondaryActions[0].description}</Button>
                        {
                            secondaryActions[1].disabled &&
                            <PopUpUpgradePlan trigger={<Button className={'disabled-btn'} primary>
                                {secondaryActions[1].description}
                            </Button>}/>
                        }
                        {
                            !secondaryActions[1].disabled &&
                            <Button primary onClick={() => secondaryActions[1].func()}>{secondaryActions[1].description}</Button>
                        }
                    </Button.Group>
                }
                {
                    secondaryActions && secondaryActions.length == 1 &&
                    <Button fluid primary onClick={() => secondaryActions[0].func()}>{secondaryActions[0].description}</Button>
                }
                {
                    !noBottomBar &&
                    <Button.Group fluid style={{height: 65}}>
                        {menuhomestudent && <Button className={selected === MENU.HOME ? 'button-bottom-bar-selected' : 'button-bottom-bar'} icon onClick={() => this.onClick(MENU.HOME, 'student')}>
                            <Icon name={MENU.HOME} size={'large'} />
                        </Button>}
                        {menuhomeprofessor && <Button className={selected === MENU.HOME ? 'button-bottom-bar-selected' : 'button-bottom-bar'} icon onClick={() => this.onClick(MENU.HOME, 'professor')}>
                            <Icon name={MENU.HOME} size={'large'} />
                        </Button>}
                        {menuplanifications && <Button className={selected === MENU.PLANIFICATIONS ? 'button-bottom-bar-selected' : 'button-bottom-bar'}
                                 icon onClick={() => this.onClick(MENU.PLANIFICATIONS, 'my-planifications')}>
                            <Icon name={MENU.PLANIFICATIONS} size={'large'}/>
                        </Button>}
                        {menudiscussions && <Button className={selected === MENU.CONTRIBUTIONS ? 'button-bottom-bar-selected' : 'button-bottom-bar'}
                                 icon onClick={() => this.onClick(MENU.CONTRIBUTIONS, 'my-contributions')}>
                            <Icon name={MENU.CONTRIBUTIONS} size={'large'}/>
                        </Button>}
                        {menustatistics && <Button className={selected === MENU.STATS ? 'button-bottom-bar-selected' : 'button-bottom-bar'}
                                                    icon onClick={() => this.onClick(MENU.STATS, 'my-stats')}>
                            <Icon name={MENU.STATS} size={'large'}/>
                        </Button>}
                        <Button className={selected === MENU.ACCOUNT ? 'button-bottom-bar-selected' : 'button-bottom-bar'} icon onClick={() => this.onClick(MENU.ACCOUNT, 'account')}>
                            <Icon name={MENU.ACCOUNT} size={'large'} />
                        </Button>
                    </Button.Group>
                }
            </div>
        )
    }
}

export default withRouter(BottomMenuBar);