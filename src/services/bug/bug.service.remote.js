import Axios from "axios"

const axios = Axios.create({
    withCredentials: true
})

const BASE_URL = import.meta.env.DEV ? "//localhost:3030/api/bug/" : "/api/bug/"

export const bugService = {
    query,
    getById,
    save,
    remove,
    downloadBugs,
    getDefaultFilter
}


async function query(filterBy = {}) {
    const { data: bugs } = await axios.get(BASE_URL, { params: filterBy })
    return bugs
}

async function getById(bugId) {
    const { data: bug } = await axios.get(BASE_URL + bugId)
    return bug
}

async function remove(bugId) {
    const { data } = await axios.delete(BASE_URL + bugId)
    return data
}

async function save(bugToSave) {
    const url = BASE_URL + (bugToSave._id || "")
    const method = bugToSave._id ? "put" : "post"
    const { data: savedBug } = await axios[method](url, bugToSave)
    return savedBug
}

async function downloadBugs() {
    return await axios.get(BASE_URL + "download", { responseType: 'blob' })
}

function getDefaultFilter() {
    return {
        title: '',
        severity: '',
    }
}