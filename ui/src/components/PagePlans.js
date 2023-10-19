import {Component} from "react";
import {withRouter} from "react-router-dom";

class PagePlans extends Component {
    state = {loading: true, plans: []}
    async componentDidMount() {
        try {
            //exclude free plan
            // const res = await listPlans();
            this.setState({loading: false, plans: [
                    {id: 1, name: 'Profesor', description: 'descripcion del plan', price: 5000},
                    {id: 1, name: 'Estudiante Avanzado', description: 'descripcion del plan', price: 5000}
                ]})
        } catch (e) {
            console.error(e)
        }
    }

    render() {
        return (
            <>
                //mostrar planes
                //o "continuar con plan gratuito"
            </>
        )
    }
}

export default withRouter(PagePlans);