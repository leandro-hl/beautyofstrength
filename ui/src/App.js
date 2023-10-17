import './App.css';
import {ContextProvider} from "./context";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import ElseRoute from "./components/ElseRoute";
import {Component} from "react";
import Home from "./components/Home";
import HomeStudent from "./components/HomeStudent";
import HomeProfessor from "./components/HomeProfessor";
import PagePlanificationList from "./components/PagePlanificationList";
import PagePlanificationDetail from "./components/PagePlanificationDetail";
import PageRoutineCreate from "./components/PageRoutineCreate";
import PageRoutineDetail from "./components/PageRoutineDetail";
import PageBlockCreate from "./components/PageBlockCreate";
import PageRoutineExecution from "./components/PageRoutineExecution";
import PageAccount from "./components/PageAccount";
import PageProfessorContributions from "./components/PageProfessorContributions";

class App extends Component {
    render() {
        return (
            <ContextProvider>
                <BrowserRouter basename={`${process.env.PUBLIC_URL}`}>
                    <Switch>
                        <Route exact path={"/"} component={Home}/>
                        <Route exact path={"/professor"} component={HomeProfessor}/>
                        <Route exact path={"/my-planifications"} component={PagePlanificationList}/>
                        <Route exact path={"/my-contributions"} component={PageProfessorContributions}/>
                        <Route exact path={"/planification"} component={PagePlanificationDetail}/>
                        <Route exact path={"/routine/execution"} component={PageRoutineExecution}/>
                        <Route exact path={"/routine/create"} component={PageRoutineCreate}/>
                        <Route exact path={"/routine"} component={PageRoutineDetail}/>
                        <Route exact path={"/block/create"} component={PageBlockCreate}/>
                        <Route exact path={"/student"} component={HomeStudent}/>
                        <Route exact path={"/account"} component={PageAccount}/>
                        <ElseRoute/>
                    </Switch>
                </BrowserRouter>
            </ContextProvider>
        );
    }
}

export default App;
