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
    downloadBugs,
    getDefaultFilter
}


function query(filterBy = {}) {
    filterBy = { ...filterBy }
    return axios.get(BASE_URL)
        .then(res => res.data)
        .then(bugs => {
            if (!filterBy.title) filterBy.title = ''
            if (!filterBy.severity) filterBy.severity = ''
            const regex = new RegExp(filterBy.title, 'i')

            return bugs.filter(bug => {
                const titleMatch = regex.test(bug.title)
                const severityMatch = (filterBy.severity === '' || bug.severity == filterBy.severity)

                return titleMatch && severityMatch
            })
        })
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
    return axios.get(BASE_URL + bugId + "/remove")
}

function save(bug) {
    return axios.get(BASE_URL + "save", { params: bug }).then(res => res.data)
}

function downloadBugs() {
    return axios.get(BASE_URL + "download", { responseType: 'blob' })
}

function getDefaultFilter() {
    return {
        title: '',
        severity: '',
    }
}