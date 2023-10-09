import {createContext, useContext, useEffect, useReducer, useState} from "react";
import axios from "axios";
import {signIn} from "./service";

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

function RegisterServiceWorkers({children}) {
    const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] = useState(false);

    useEffect(() => {
        async function registerServiceWorker() {
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`);
                    alert('Service Worker registered with scope:'+ registration.scope);
                } catch (error) {
                    alert('Service Worker registration failed:'+ error);
                    // You can handle failure as you see fit, perhaps setting another state variable or logging the error.
                }
            } else {
                alert('No service worker');
            }
            setIsServiceWorkerRegistered(true);
        }

        registerServiceWorker();
    }, []);

    if (!isServiceWorkerRegistered) {
        return null; // or return a loading spinner or some placeholder content if desired
    }

    return <>{children}</>;
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
                <RegisterServiceWorkers>
                    {children}
                </RegisterServiceWorkers>
            </ResponseInterceptor>
        </AppContext.Provider>
    )
}