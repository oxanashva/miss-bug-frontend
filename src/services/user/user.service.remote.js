import Axios from "axios"

const axios = Axios.create({
    withCredentials: true
})

const STORAGE_KEY_LOGGEDIN_USER = "loggedinUser"

const BASE_URL = import.meta.env.DEV ? "//localhost:3030/api/" : "/api/"

const BASE_USER_URL = BASE_URL + "user/"
const BASE_AUTH_URL = BASE_URL + "auth/"

export const userService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,

    login,
    logout,
    signup,
    getLoggedinUser,
    saveLocalUser,
    getEmptyUser,
}


async function query(filterBy = {}) {
    const { data: users } = await axios.get(BASE_USER_URL, { params: filterBy })
    return users
}

async function getById(userId) {
    const { data: user } = await axios.get(BASE_USER_URL + userId)
    return user
}

async function remove(userId) {
    const { data } = await axios.delete(BASE_USER_URL + userId)
    return data
}

async function save(userToSave) {
    const url = BASE_USER_URL + (userToSave._id || "")
    const method = userToSave._id ? "put" : "post"
    const { data: savedUser } = await axios[method](url, userToSave)
    return savedUser
}

function getDefaultFilter() {
    return {
        fullname: "",
        username: "",
        score: "",
    }
}

async function login(credentials) {
    const { data: user } = await axios.post(BASE_AUTH_URL + "login", credentials)
    if (user) {
        return saveLocalUser(user)
    }
}

async function signup(credentials) {
    const { data: user } = await axios.post(BASE_AUTH_URL + "signup", credentials)
    return saveLocalUser(user)
}

async function logout() {
    await axios.post(BASE_AUTH_URL + "logout")
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function saveLocalUser(user) {
    user = {
        _id: user._id,
        fullname: user.fullname,
        isAdmin: user.isAdmin,
        imgUrl: user.imgUrl,
        score: user.score
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function getEmptyUser() {
    return {
        username: "",
        fullname: "",
        password: "",
        imgUrl: "",
    }
}