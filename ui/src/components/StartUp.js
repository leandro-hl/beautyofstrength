import {Component} from "react";
import {getLocalInfo, getUserPermissions} from "../service";
import {AppContext, setData} from "../context";
import {Loader} from "semantic-ui-react";
import {withRouter} from "react-router-dom";
import axios from "axios";
import {isLocalhost, queryParam, setTheme} from "../functions";

class StartUp extends Component {
    static contextType = AppContext
    state = {loading: true}

    async loadUserData() {
        try {
            const res = await getUserPermissions();
            this.context.dispatch(setData({permissions: res.data, noMenu: false, secondaryActions:[]}))
        } catch (e) {
            console.error(e)
        }
    }

    setTheme() {
        const {state: {darkTheme}} = this.context
        setTheme(darkTheme)
    }

    async loadLocalEnvironment() {
        try {
            const {state: {auth_token}}=this.context
            if (!auth_token) {
                const res = await getLocalInfo();
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data}`;
                this.context.dispatch(setData({auth_token: res.data}))
            } else {
                axios.defaults.headers.common['Authorization'] = `Bearer ${auth_token}`;
            }
        } catch (e) {
            console.error(e)
            localStorage.removeItem("state")
            this.props.history.push('/signin')
            this.context.dispatch(setData({auth_token: null, noMenu: true, secondaryActions:[]}))
        }
    }
    async componentDidMount() {
        const shareParam = queryParam(this.props, 'share')
        if (shareParam) {
            localStorage.setItem('routine-shared', shareParam)
        }
        if (isLocalhost()) {
            await this.loadLocalEnvironment()
        }
        this.setTheme()
        await this.loadUserData()
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