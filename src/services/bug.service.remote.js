import Axios from "axios"

const axios = Axios.create({
    withCredentials: true
})

const BASE_URL = 'http://localhost:3030/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
}


function query() {
    return axios.get(BASE_URL).then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
    return axios.get(BASE_URL + bugId + "remove")
}

function save(bug) {
    return axios.get(BASE_URL + "save", { params: bug }).then(res => res.data)
}