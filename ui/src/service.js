import axios from "axios";

const host = `http://localhost:3001/api/`

axios.interceptors.request.use((config) => {
    config.baseURL = host
    return config
})

export function signIn(username) {
    return axios.post("signIn", {username: username, password:'password'})
}

export function listPlanifications() {
    return axios.get("listPlanifications")
}

export function listRoutines(planificationId) {
    return axios.get("listRoutines?planificationId="+planificationId)
}

export function getRoutineDetails(routineId) {
    return axios.get("getRoutineDetails?routineId="+routineId)
}

export function listExercises() {
    return axios.get("listExercises")
}

export function saveExercisesBlock(payload) {
    return axios.post("saveExercisesBlock", payload)
}

export function saveExercisesBlockCpt(payload) {
    return axios.post("saveExercisesBlockCpt", payload)
}

export function saveExercisesBlockAmrap(payload) {
    return axios.post("saveExercisesBlockAmrap", payload)
}

export function saveExercisesBlockCombo(payload) {
    return axios.post("saveExercisesBlockCombo", payload)
}

export function saveExerciseBlockPir(payload) {
    return axios.post("saveExerciseBlockPir", payload)
}

export function retrieveVapidPublicKey() {
    return axios.get("retrieveVapidPublicKey")
}

export function saveUserDevicePushNotificationSubscription(payload) {
    return axios.post("saveUserDevicePushNotificationSubscription", payload)
}

export function saveUserTrainedToday(payload) {
    return axios.post("saveUserTrainedToday", payload)
}

export function shareRoutine(payload) {
    return axios.post("shareRoutine", payload)
}

export function createPlanification(payload) {
    return axios.post("createPlanification", payload)
}

export function getUserLoadedTrainingToday() {
    return axios.get("getUserLoadedTrainingToday")
}

//todo: delete
export function testPushNotificationWorks() {
    return axios.post("testPushNotificationWorks")
}