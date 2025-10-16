/**
 * Copyright 2025 Leandro Herenu - BOS (Beauty Of Strength)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

export function listRoutineTemplates() {
    return axios.get("listRoutineTemplates")
}

export function listMyAthletes() {
    return axios.get("listMyAthletes")
}

export function listWorkoutTemplates() {
    return axios.get("listWorkoutTemplates")
}

export function listMyVideos() {
    return axios.get("listMyVideos")
}

export function listPlanifications() {
    return axios.get("listPlanifications")
}

export function listUserRms() {
    return axios.get("listUserRms")
}

export function listMyLastMonthTrainings() {
    return axios.post("listMyLastMonthTrainings")
}

export function getPlanificationDetails(planificationId) {
    return axios.get("getPlanificationDetails?planificationId=" + planificationId)
}

export function getRoutineDetails(routineId, isTemplate) {
    return axios.get(`getRoutineDetails?routineId=${routineId}&template=${isTemplate}`)
}

export function getSharedRoutineDetails(share) {
    return axios.get("getSharedRoutineDetails?share=" + share)
}

export function listExercises() {
    return axios.get("listExercises")
}

export function listEquipment() {
    return axios.get("listEquipment")
}

export function listQueuedPlanificationAccessRequests() {
    return axios.get("listQueuedPlanificationAccessRequests")
}

export function listLatestEvents() {
    return axios.get("listLatestEvents")
}

export function listLastUserRmHistoryStats() {
    return axios.get("listLastUserRmHistoryStats")
}

export function saveNewRm(payload) {
    return axios.post("saveNewRm", payload)
}

export function startJourney(payload) {
    return axios.post("startJourney", payload)
}

export function uploadRoutineImage(id, planificationId, file, isTemplate) {
    const formData = new FormData();

    formData.append(
        "routine",
        file,
        file.name
    );

    return axios.post(
        `uploadRoutineImage?routineId=${id}&planificationId=${planificationId}&template=${isTemplate}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
}

export function saveRoutineExecution(payload) {
    return axios.post("saveRoutineExecution", payload)
}

export function uploadExerciseVideoLink(payload) {
    return axios.post("uploadExerciseVideoLink", payload)
}

export function addToMyEquipment(payload) {
    return axios.post("addToMyEquipment", payload)
}

export function copyTemplateRoutineToPlanification(payload) {
    return axios.post("copyTemplateRoutineToPlanification", payload)
}

export function deletePlanification(id) {
    return axios.post("deletePlanification", {id})
}

export function savePlanificationEditions(payload) {
    return axios.post("savePlanificationEditions", payload)
}

export function repeatLastMesocycle(payload) {
    return axios.post("repeatLastMesocycle", payload)
}

export function saveRoutineEditions(payload) {
    return axios.post("saveRoutineEditions", payload)
}

export function saveSharedRoutine(payload) {
    return axios.post("saveSharedRoutine", payload)
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

export function acceptInstructorInvite(payload) {
    return axios.post("acceptInstructorInvite", payload)
}

export function shareRoutine(payload) {
    return axios.post("shareRoutine", payload)
}

export function sharePlanification(payload) {
    return axios.post("sharePlanification", payload)
}

export function inviteAthletes() {
    return axios.post("inviteAthletesToAssociateWithMe")
}

export function actionateRoutine(payload) {
    return axios.post("actionateRoutine", payload)
}

export function saveProfileConfiguration(payload) {
    return axios.post("saveProfileConfiguration", payload)
}

export function getProfileConfiguration() {
    return axios.post("getProfileConfiguration")
}

export function createPlanification(payload) {
    return axios.post("createPlanification", payload)
}

export function createNewExercise(payload) {
    return axios.post("createNewExercise", payload)
}

export function getUserLoadedTrainingToday() {
    return axios.get("getUserLoadedTrainingToday")
}

export function getUserAccountDetails() {
    return axios.get("getUserAccountDetails")
}

export function listUserAccountEquipment() {
    return axios.get("listUserAccountEquipment")
}

export function acceptPlanificationAccessRequest(payload) {
    return axios.post("acceptPlanificationAccessRequest", payload)
}

export function declinePlanificationAccessRequest(payload) {
    return axios.post("declinePlanificationAccessRequest", payload)
}