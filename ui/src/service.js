import axios from "axios";

const host = 'http://192.168.0.131:3001/api/'

axios.interceptors.request.use((config) => {
    config.baseURL = host
    return config
})

export function listExercises() {
    return axios.get("listExercises")
}

export function saveExercisesBlock(payload) {
    return axios.post("saveExercisesBlock", payload)
}