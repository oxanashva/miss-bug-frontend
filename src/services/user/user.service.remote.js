import Axios from "axios"

const axios = Axios.create({
    withCredentials: true
})

const BASE_URL = 'http://localhost:3030/api/user/'

export const userService = {
    query,
    getById,
    save,
    remove,
    // downloadUsers,
    getDefaultFilter
}


async function query(filterBy = {}) {
    const { data: users } = await axios.get(BASE_URL, { params: filterBy })
    return users
}

async function getById(userId) {
    const { data: user } = await axios.get(BASE_URL + userId)
    return user
}

async function remove(userId) {
    const { data } = await axios.delete(BASE_URL + userId)
    return data
}

async function save(userToSave) {
    const url = BASE_URL + (userToSave._id || "")
    const method = userToSave._id ? "put" : "post"
    const { data: savedUser } = await axios[method](url, userToSave)
    return savedUser
}

// async function downloadUsers() {
//     return await axios.get(BASE_URL + "download", { responseType: 'blob' })
// }

function getDefaultFilter() {
    return {
        fullname: "",
        username: "",
        score: "",
    }
}