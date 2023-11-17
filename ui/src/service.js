import axios from "axios";
import {isLocalhost} from "./functions";

let host = `https://bos.team/api/`
if (isLocalhost()) {
    host = `http://localhost:3001/api/`
    axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'test'
}

axios.interceptors.request.use((config) => {
    config.baseURL = host
    return config
})

export function checkAuth() {
    return axios.post("checkAuth")
}

export function getUserPermissions() {
    return axios.post("getUserPermissions")
}

export function getLocalInfo() {
    return axios.post("getLocalInfo")
}

export function signIn(username) {
    return axios.post("signIn", {username: username, password: 'password'})
}

export function signUpWithTestUser(accountType, src) {
    return axios.post("createTestUser?accountType="+accountType+"&utm_source="+src)
}

export function signUp(username) {
    return axios.post("signUp", {username: username, password: 'password'})
}

export function listPlanifications() {
    return axios.get("listPlanifications")
}

export function listRoutines(planificationId) {
    return axios.get("listRoutines?planificationId=" + planificationId)
}

export function getRoutineDetails(routineId) {
    return axios.get("getRoutineDetails?routineId=" + routineId)
}

export function getSharedRoutineDetails(share) {
    return axios.get("getSharedRoutineDetails?share=" + share)
}

export function listExercises() {
    return axios.get("listExercises")
}

export function listQueuedPlanificationAccessRequests() {
    return axios.get("listQueuedPlanificationAccessRequests")
}

export function savePlanificationEditions(payload) {
    return axios.post("savePlanificationEditions", payload)
}

export function saveRoutineEditions(payload) {
    return axios.post("saveRoutineEditions", payload)
}

export function saveExercisesBlock(payload) {
    return axios.post("saveExercisesBlock", payload)
}

export function saveExercisesBlockFree(payload) {
    return axios.post("saveExercisesBlockFree", payload)
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

export function savePlanificationDays(payload) {
    return axios.post("savePlanificationDays", payload)
}

export function saveUserTrainedToday(payload) {
    return axios.post("saveUserTrainedToday", payload)
}

export function signout() {
    return axios.post("signout")
}

export function requestAccessToSharedPlanification(payload) {
    return axios.post("requestAccessToSharedPlanification", payload)
}


export function shareRoutine(payload) {
    return axios.post("shareRoutine", payload)
}

export function sharePlanification(payload) {
    return axios.post("sharePlanification", payload)
}

export function actionateRoutine(payload) {
    return axios.post("actionateRoutine", payload)
}

export function createPlanification(payload) {
    return axios.post("createPlanification", payload)
}

export function getUserLoadedTrainingToday() {
    return axios.get("getUserLoadedTrainingToday")
}

export function getUserAccountDetails() {
    return axios.get("getUserAccountDetails")
}

export function acceptPlanificationAccessRequest(payload) {
    return axios.post("acceptPlanificationAccessRequest", payload)
}

export function declinePlanificationAccessRequest(payload) {
    return axios.post("declinePlanificationAccessRequest", payload)
}