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
    popupMessage: {},
    permissions: {},
    draftBlockGroupers: [],
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
    darkTheme: false,
    prepareExercises: {
        data: {
            exercises: []
        }
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

export function showSuccess(ctx, title, description) {
    ctx.dispatch(setData({popupMessage: {show:true, title, description, negative:false}}))
    const timeId = setTimeout(() => {
        clearTimeout(timeId)
        ctx.dispatch(setData({popupMessage: {show: false}}))
    }, 1500)
}

export function showError(title, description) {
    return {
        type: ACTIONS.DATA,
        payload: {popupMessage: {show:true, title, description, negative:true}},
    }
}

export function calculareError(code) {
    switch (code) {
        case 'shared_routine_expired':
            return {
                title: '',
                description: 'La rutina a la que quiere acceder expiro'
            }
        case 'no_shared_routine':
            return {
                title: '',
                description: 'No se encontro la rutina a la que quiere acceder'
            }
        case 'shared_routine_already_copied':
            return {
                title: '',
                description: 'No puede guardar la misma rutina mas de una vez'
            }
        case 'free_saved_routines_limit':
            return {
                title: '',
                description: 'Pasate a premium para guardar mas de una rutina!'
            }
        case 'free_saved_routines_no':
            return {
                title: '',
                description: 'Pasate a premium para guardar la rutina!'
            }
        case 'free_create_routine_limit':
            return {
                title: '',
                description: 'Pasate a premium para crear mas de una rutina!'
            }
        case 'free_actionate_routine_limit':
            return {
                title: '',
                description: 'Pasate a premium para accionar mas de una rutina por dia!'
            }
        case 'free_work_routine_limit':
            return {
                title: '',
                description: 'Pasate a premium para agregar mas trabajos a una rutina!'
            }
        case 'work_exercises_limit':
            return {
                title: '',
                description: 'Superaste la cantidad de ejercicios que se pueden agregar a un trabajo'
            }
        case 'new_exercises_limit':
            return {
                title: '',
                description: 'Superaste la cantidad de ejercicios nuevos que puedes crear'
            }
        case 'exercise_name_limit':
            return {
                title: '',
                description: 'El nombre del ejercicio no puede tener mas de 70 caracteres'
            }
        case 'cannot_save_routine':
            return {
                title: '',
                description: 'La rutina no se puede guardar'
            }
        case 'cannot_modify_routine':
            return {
                title: '',
                description: 'La rutina no se puede modificar'
            }
        case 'create_planification_reserved_names':
            return {
                title: '',
                description: 'No podes usar nombres reservados para crear planificaciones'
            }
        case 'create_planification_name_max_50':
            return {
                title: '',
                description: 'El nombre de la planificacion no debe tener mas de 50 letras'
            }
        case 'create_blockgroup_name_max_50':
            return {
                title: '',
                description: 'El nombre del bloque no debe tener mas de 50 letras'
            }
        case 'update_routine_name_max':
            return {
                title: '',
                description: 'El nombre de la rutina no debe tener mas de 50 letras'
            }
        case 'update_routine_blockgroup_name_max_35':
            return {
                title: '',
                description: 'El nombre del bloque no debe tener mas de 35 letras'
            }
        case 'update_routine_blockgroup_name_required':
            return {
                title: '',
                description: 'El nombre del bloque es requerido'
            }
        case 'update_routine_workout_limit':
            return {
                title: '',
                description: 'Estas superando la cantidad de trabajos que se pueden actualizar al mismo tiempo. Contactate con soporte.'
            }
        case 'update_routine_exercise_limit':
            return {
                title: '',
                description: 'Estas superando la cantidad de ejercicios que se pueden actualizar al mismo tiempo. Contactate con soporte.'
            }
        case 'update_routine_blockgroup_limit':
            return {
                title: '',
                description: 'Estas superando la cantidad de bloques que se pueden actualizar al mismo tiempo. Contactate con soporte.'
            }
        case 'no_access':
            return {
                title: '',
                description: 'No tienes acceso para realizar la operacion'
            }
        case 'no_access_premium':
            return {
                title: '',
                description: 'Pasate a premium para poder realizar esta operacion!'
            }
        case 'required_planificationid':
            return {
                title: '',
                description: 'El ID de la planificacion es un dato requerido'
            }
        case 'required_at_least_one_exercise':
            return {
                title: '',
                description: 'Al menos un ejercicio es requerido'
            }
        case 'required_planification_week_one_day':
            return {
                title: '',
                description: 'La planificacion debe tener al menos un dia'
            }
        case 'cannot_edit_planification_being_executed':
            return {
                title: '',
                description: 'La planificacion ya esta en progreso y no puede ser modificada'
            }
        case 'create_planification_name_required':
            return {
                title: '',
                description: 'La planificacion debe tener un nombre'
            }
        case 'planification_id_required':
            return {
                title: '',
                description: 'El ID de planificacion es requerido'
            }
        case 'planification_mesocycle_max':
            return {
                title: '',
                description: 'El Mesociclo puede ser de hasta 30 dias. Contactanos para saber mas'
            }
        case 'unexpected_error':
            return {title: '', description: 'Ocurrio un error y la operacion no se pudo completar'}
        default:
            return {title: '', description: 'La operacion no se pudo completar'}
    }
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

    useEffect(() => {
        axios.interceptors.response.use(
            (r) => { return r },
            err => {
                if (err.response.status === 400) {
                    const {code} = err.response.data
                    const {title, description} = calculareError(code)
                    const timeId = setTimeout(() => {
                        clearTimeout(timeId)
                        dispatch(setData({popupMessage: {show: false}}))
                    }, 2500)
                    dispatch(showError(title, description))
                } else if (err.response.status === 401) {
                    dispatch(setData({auth_token: null, noMenu: true, secondaryActions:[]}))
                    // history?.push('/signin');
                    localStorage.removeItem("state")
                }
                throw err
            }
        )
    }, [])

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