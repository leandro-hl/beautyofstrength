import {createContext, useContext, useEffect, useReducer, useState} from "react";
import axios from "axios";
import {isLocalhost} from "./functions";
import {useHistory} from "react-router-dom";
import {MENU} from "./enums";

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
    isAuthenticated: undefined,
    permissions: {},
    menuButtonSelected: MENU.HOME,
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
    },
    darkTheme: false
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

    if (action.cache) {
        const cached = localStorage.getItem('state')
        if (cached) {
            const cachedData = JSON.parse(atob(cached))
            const newData = {...cachedData, ...action.payload}
            localStorage.setItem('state', btoa(JSON.stringify(newData)))
        } else {
            localStorage.setItem('state', btoa(JSON.stringify({...action.payload})))
        }
    }

    if (isLocalhost()) {
        //this replaces the cookie behavior
        const cached = localStorage.getItem('state')
        if (cached) {
            const cachedData = JSON.parse(atob(cached))
            const newData = {...cachedData, auth_token: newState.auth_token}
            localStorage.setItem('state', btoa(JSON.stringify(newData)))
        } else {
            localStorage.setItem('state', btoa(JSON.stringify({auth_token: newState.auth_token})))
        }
    }

    return newState
}

export function setData(data, cache) {
    return {
        type: ACTIONS.DATA,
        payload: data,
        cache: cache
    }
}

function RegisterServiceWorkers({children}) {
    const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] = useState(false);

    useEffect(() => {
        async function registerServiceWorker() {
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`);

                    if (isLocalhost()) {
                        console.log('Service Worker registered with scope:'+ registration.scope);
                    }
                } catch (error) {
                    if (isLocalhost()) {
                        console.error('Service Worker registration failed:'+ error);
                    }
                }
            } else if (isLocalhost()){
                console.error('No service worker');
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
                //todo: separate test logic from productive one
                dispatch(setData({auth_token: null, noMenu: true, secondaryActions:[]}))
                history?.push('/home');
                localStorage.removeItem("state")
            }
            throw err
        }
    )

    return <>{children}</>
}

export const AppContext = createContext()

export function ContextProvider({children}) {
    const lastState = localStorage.getItem('state')
    let currentState = {}
    if (lastState) {
        currentState = {...initialState, ...JSON.parse(atob(lastState))}
    } else {
        currentState = initialState
    }

    const darkTheme = localStorage.getItem('darkTheme')
    currentState.darkTheme = darkTheme === "true" ? true : false

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