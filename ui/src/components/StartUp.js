import {Component} from "react";
import {getLocalInfo, getUserPermissions, listEquipment} from "../service";
import {AppContext, setData} from "../context";
import {Loader} from "semantic-ui-react";
import {withRouter} from "react-router-dom";
import axios from "axios";
import {isLocalhost, queryParam, setTheme} from "../functions";

class StartUp extends Component {
    static contextType = AppContext
    state = {loading: true}

    setTheme() {
        const {state: {darkTheme}} = this.context
        setTheme(darkTheme)
    }

    async componentDidMount() {
        const planShareParam = queryParam(this.props, 'pshare')
        const shareParam = queryParam(this.props, 'share')
        const inviteParam = queryParam(this.props, 'invite')
        if (shareParam) {
            localStorage.setItem('routine-shared', shareParam)
        } else if (planShareParam) {
            const url = new URL(window.location);
            const params = new URLSearchParams(url.search);
            params.delete('pshare');
            window.history.replaceState({}, '', `${url.pathname}?${params}${url.hash}`);
            localStorage.setItem('planification-shared', planShareParam)
        } else if (inviteParam) {
            localStorage.setItem('instructor-invite', inviteParam)
        }
        this.setTheme()
        this.setState({loading: false})
    }
    render() {
        const {loading} = this.state
        if (loading) {
            return <Loader active/>
        }
        const {children} = this.props
        return <>{children}</>
    }
}

export default withRouter(StartUp)