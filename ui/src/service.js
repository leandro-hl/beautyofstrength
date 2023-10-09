import axios from "axios";

const host = `https://HOST/api/`

axios.interceptors.request.use((config) => {
    config.baseURL = host
    return config
})

export function signIn(username) {
    return axios.post("signIn", {username: username, password:'password'})
}

export function listExercises() {
    return axios.get("listExercises")
}

export function saveExercisesBlock(payload) {
    return axios.post("saveExercisesBlock", payload)
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

export function getUserLoadedTrainingToday() {
    return axios.get("getUserLoadedTrainingToday")
}

//todo: delete
export function testPushNotificationWorks() {
    return axios.post("testPushNotificationWorks")
}