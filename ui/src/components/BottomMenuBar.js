import React, {Component} from "react";
import {Button, Icon} from "semantic-ui-react";
import {withRouter} from "react-router-dom";
import {AppContext} from "../context";

class BottomMenuBar extends Component {
    static contextType = AppContext
    constructor(props) {
        super(props);
    }

    onClick(name, redirect) {
        const {selected} = this.props

        if (selected !== name) {
            this.props.onSelected(name)
        }
        this.props.history.push(redirect)
    }

    render() {
        const {state: {permissions: {menuplanifications, menudiscussions, menustatistics}}} = this.context
        const {selected, secondaryActions, noBottomBar} = this.props
        return (
            <div style={{position: 'absolute', bottom: 0, width: '100%', maxWidth: 600}}>
                {
                    secondaryActions && secondaryActions.length == 2 &&
                    <Button.Group fluid>
                        <Button secondary onClick={() => secondaryActions[0].func()}>{secondaryActions[0].description}</Button>
                        <Button primary onClick={() => secondaryActions[1].func()}>{secondaryActions[1].description}</Button>
                    </Button.Group>
                }
                {
                    secondaryActions && secondaryActions.length == 1 &&
                    <Button fluid primary onClick={() => secondaryActions[0].func()}>{secondaryActions[0].description}</Button>
                }
                {
                    !noBottomBar &&
                    <Button.Group fluid style={{height: 65}}>
                        <Button className={selected === 'home' ? 'button-bottom-bar-selected' : 'button-bottom-bar'} icon onClick={() => this.onClick('home', 'professor')}>
                            <Icon name='home' size={'large'} />
                        </Button>
                        {menuplanifications && <Button className={selected === 'lab' ? 'button-bottom-bar-selected' : 'button-bottom-bar'}
                                 icon onClick={() => this.onClick('lab', 'my-planifications')}>
                            <Icon name='lab' size={'large'}/>
                        </Button>}
                        {menudiscussions && <Button className={selected === 'users' ? 'button-bottom-bar-selected' : 'button-bottom-bar'}
                                 icon onClick={() => this.onClick('users', 'my-contributions')}>
                            <Icon name='users' size={'large'}/>
                        </Button>}
                        {menustatistics && <Button className={selected === 'users' ? 'button-bottom-bar-selected' : 'button-bottom-bar'}
                                                    icon onClick={() => this.onClick('stats', 'my-stats')}>
                            <Icon name='bullhorn' size={'large'}/>
                        </Button>}
                        <Button className={selected === 'user' ? 'button-bottom-bar-selected' : 'button-bottom-bar'} icon onClick={() => this.onClick('user', 'account')}>
                            <Icon name='user' size={'large'} />
                        </Button>
                    </Button.Group>
                }
            </div>
        )
    }
}

export default withRouter(BottomMenuBar);