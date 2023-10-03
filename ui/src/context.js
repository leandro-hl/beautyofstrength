import {createContext, useContext, useReducer} from "react";
import axios from "axios";

export const STEPS = {
    LOGGED: "LOGGED"
}

export const ACTIONS = {
    DEFAULT: "DEFAULT"
}

export function setValidationError(error) {
    return {
        type: ACTIONS.VALIDATION_ERROR,
        payload: error
    }
}

const initialState = {}

const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.DEFAULT:
            return {
                ...state
            };
        default:
            return state;
    }
}

export function setStep(step) {
    return {
        type: ACTIONS.DEFAULT,
        payload: STEPS.LOGGED
    }
}

function ResponseInterceptor({children}) {
    const {dispatch} = useContext(AppContext)

    axios.interceptors.response.use(
        (r) => { return r },
        err => {
            if (err.response.status === 400) {
                dispatch(setValidationError(err.response.data.errors))
            }

            return Promise.reject(err);
        }
    )

    return <>{children}</>
}

export const AppContext = createContext()

export function ContextProvider({children}) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AppContext.Provider value={{state, dispatch}}>
            <ResponseInterceptor>
                {children}
            </ResponseInterceptor>
        </AppContext.Provider>
    )
}