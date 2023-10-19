import {createContext, useContext, useEffect, useReducer, useState} from "react";
import axios from "axios";
import {isLocalhost} from "./functions";
import {useHistory} from "react-router-dom";

export const ACTIONS = {
    DATA: "DATA"
}

export function setValidationError(error) {
    return {
        type: ACTIONS.VALIDATION_ERROR,
        payload: error
    }
}

const initialState = {
    permissions: {},
    noBottomBar: true,
    withTopBar: false,
    planificationId: null,
    routineId: null,
    noMenu: true,
    secondaryActions: [],
    routineDetails: {
        name: '',
        blocks: [],
        nextBlockNumber: null
    }
}

const reducer = (state, action) => {
    let newState = {}
    switch (action.type) {
        case ACTIONS.DATA:
            newState = {
                ...state,
                ...action.payload
            };
            break
        default:
            newState = {...state};
    }
    localStorage.setItem('state', JSON.stringify(newState))
    return newState
}

export function setData(data) {
    return {
        type: ACTIONS.DATA,
        payload: data
    }
}

function RegisterServiceWorkers({children}) {
    const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] = useState(false);

    useEffect(() => {
        async function registerServiceWorker() {
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`);
                    console.log('Service Worker registered with scope:'+ registration.scope);
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
    const history = useHistory();

    axios.interceptors.response.use(
        (r) => { return r },
        err => {
            if (err.response.status === 400) {
                dispatch(setValidationError(err.response.data.errors))
            } else if (err.response.status === 401) {
                dispatch(setData({auth_token: null, noMenu: true, secondaryActions:[]}))
                history?.push('/signin');
            }
            console.error(err)
        }
    )

    return <>{children}</>
}

export const AppContext = createContext()

export function ContextProvider({children}) {
    const lastState = localStorage.getItem('state')
    let currentState = {}
    if (lastState) {
        currentState = JSON.parse(lastState)
    } else {
        currentState = initialState
    }

    const [state, dispatch] = useReducer(reducer, currentState);

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