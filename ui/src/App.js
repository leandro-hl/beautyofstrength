import './App.css';
import './vars.css';
import {ContextProvider} from "./context";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import ElseRoute from "./components/ElseRoute";
import {Component} from "react";
import HomeStudent from "./components/PageHomeStudent";
import HomeProfessor from "./components/PageHomeProfessor";
import PagePlanificationList from "./components/PagePlanificationList";
import PagePlanificationDetail from "./components/PagePlanificationDetail";
import PageRoutineCreate from "./components/PageRoutineCreate";
import PageRoutineDetail from "./components/PageRoutineDetail";
import PageBlockCreate from "./components/PageBlockCreate";
import PageRoutineExecution from "./components/PageRoutineExecution";
import PageAccount from "./components/PageAccount";
import PageProfessorContributions from "./components/PageProfessorContributions";
import LayoutMobile from "./components/LayoutMobile";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import PagePlans from "./components/PagePlans";
import StartUp from "./components/StartUp";
import PageStats from "./components/PageStats";
import PageTermsAndConditions from "./components/PageTermsAndConditions";
import PagePrivacyPolicies from "./components/PagePrivacyPolicies";
import PageRoot from "./components/PageRoot";
import PagePlanificationSelectDays from "./components/PagePlanificationSelectDays";
import PageSubscriptionApproved from "./components/PageSubscriptionApproved";
import ModalExerciseVideo from "./components/ModalExerciseVideo";
import PagePublicHome from "./components/PagePublicHome";
import {PopUpMessage} from "./components/PopUpMessage";
import PageCreateSuite from "./components/PageCreateSuite";
import PageOnboarding from "./components/PageOnboarding";
import PagePublicHomeV2 from "./components/PagePublicHomeV2";
import PageBundles from "./components/mui/PageBundles";
import PageAccountV2 from "./components/mui/PageAccountV2";
import {PageMercadoPago} from "./components/mui/PageMercadoPago";
import './fonts/rubik.css';

class App extends Component {
    render() {
        return (
            <BrowserRouter basename={`${process.env.PUBLIC_URL}`}>
                <ContextProvider>
                    <StartUp>
                        <LayoutMobile>
                            <Switch>
                                <Route exact path={"/"} component={PageRoot}/>
                                <Route exact path={"/home"} component={PagePublicHomeV2}/>
                                <Route exact path={"/signin"} component={SignIn}/>
                                <Route exact path={"/terms"} component={PageTermsAndConditions}/>
                                <Route exact path={"/privacy-policies"} component={PagePrivacyPolicies}/>
                                <Route exact path={"/bundles"} component={PageBundles}/>
                                <Route exact path={"/checkout"} component={PageMercadoPago}/>
                                {/*<Route exact path={"/signup"} component={SignUp}/>*/}
                                <PrivateRoute exact path={"/onboarding"} component={PageOnboarding}/>
                                <PrivateRoute exact path={"/suite"} component={PageCreateSuite}/>
                                <PrivateRoute exact path={"/plans"} component={PagePlans}/>
                                <PrivateRoute exact path={"/subscription-approved"}
                                              component={PageSubscriptionApproved}/>
                                <PrivateRoute exact path={"/my-planifications"} component={PagePlanificationList}/>
                                <PrivateRoute exact path={"/my-contributions"}
                                              component={PageProfessorContributions}/>
                                <PrivateRoute exact path={"/my-stats"} component={PageStats}/>
                                <PrivateRoute exact path={"/planification"} component={PagePlanificationDetail}/>
                                <PrivateRoute exact path={"/planification-days"}
                                              component={PagePlanificationSelectDays}/>
                                <PrivateRoute exact path={"/routine/execution"} component={PageRoutineExecution}/>
                                <PrivateRoute exact path={"/routine/create"} component={PageRoutineCreate}/>
                                <PrivateRoute exact path={"/routine"} component={PageRoutineDetail}/>
                                <PrivateRoute exact path={"/block/create"} component={PageBlockCreate}/>
                                <PrivateRoute exact path={"/professor"} component={HomeProfessor}/>
                                <PrivateRoute exact path={"/student"} component={HomeStudent}/>
                                <PrivateRoute exact path={"/account"} component={PageAccountV2}/>
                                <ElseRoute/>
                            </Switch>
                        </LayoutMobile>
                        <ModalExerciseVideo/>
                        <PopUpMessage/>
                    </StartUp>
                </ContextProvider>
            </BrowserRouter>
        );
    }
}

export default App;
