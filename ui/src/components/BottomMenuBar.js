import React, {Component} from "react";
import {Button, Icon} from "semantic-ui-react";
import {withRouter} from "react-router-dom";

class BottomMenuBar extends Component {
    render() {
        //todo: if user type then show xyz buttons (or get from backend an array of icon names and urls
        return (
            <div style={{position: 'absolute', bottom: 0, width: '100%'}}>
                <Button.Group fluid style={{height: 65}}>
                    <Button icon onClick={() => this.props.history.push('professor')}>
                        <Icon name='home' size={'big'} />
                    </Button>
                    <Button icon onClick={() => this.props.history.push('my-planifications')}>
                        <Icon name='motorcycle' size={'big'} />
                    </Button>
                    <Button icon onClick={() => this.props.history.push('my-contributions')}>
                        <Icon name='search' size={'big'} />
                    </Button>
                    <Button icon onClick={() => this.props.history.push('account')}>
                        <Icon name='user' size={'big'} />
                    </Button>
                </Button.Group>
            </div>
        )
    }
}

export default withRouter(BottomMenuBar);