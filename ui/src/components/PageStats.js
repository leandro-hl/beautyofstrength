import {Component} from "react";
import {withRouter} from "react-router-dom";

class PageStats extends Component {
    state = {loading: true, plans: []}
    async componentDidMount() {
        try {
        } catch (e) {
            console.error(e)
        }
    }

    render() {
        return (
            <>
                //mostrar ESTADISTICAS
            </>
        )
    }
}

export default withRouter(PageStats);