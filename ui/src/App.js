import './App.css';
import {ContextProvider} from "./context";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import ElseRoute from "./components/ElseRoute";
import Home from "./components/Home";
import {HomeStudent} from "./components/HomeStudent";
import HomeProfessor from "./components/HomeProfessor";

function App() {
    return (
      <ContextProvider>
          <BrowserRouter basename={`${process.env.PUBLIC_URL}`}>
              <Switch>
                  <Route exact path={"/"} component={Home}/>
                  <Route path={"/professor"} component={HomeProfessor}/>
                  <Route path={"/student"} component={HomeStudent}/>
                  <ElseRoute/>
              </Switch>
          </BrowserRouter>
      </ContextProvider>
    );
}

export default App;
