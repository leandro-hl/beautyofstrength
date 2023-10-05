import axios from "axios";

const host = 'http://localhost:3001/api/'

axios.interceptors.request.use((config) => {
    config.baseURL = host
    return config
})

export function signIn() {
    return axios.post("signIn", {username: 'username', password:'password'})
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

export function testPushNotificationWorks() {
    return axios.post("testPushNotificationWorks")
}