
import { storageService } from '../async-storage.service.js'

const STORAGE_KEY = 'userDB'

export const userService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter
}

function query(filterBy = {}) {
    filterBy = { ...filterBy }

    return storageService.query(STORAGE_KEY)
        .then(users => {
            if (!filterBy.title) filterBy.title = ''
            if (!filterBy.severity) filterBy.severity = ''
            const regex = new RegExp(filterBy.title, 'i')

            return users.filter(user => {
                const titleMatch = regex.test(user.title)
                const severityMatch = (filterBy.severity === '' || user.severity == filterBy.severity)

                return titleMatch && severityMatch
            })
        })
}

function getById(userId) {
    return storageService.get(STORAGE_KEY, userId)
}

function remove(userId) {
    return storageService.remove(STORAGE_KEY, userId)
}

function save(user) {
    if (user._id) {
        return storageService.put(STORAGE_KEY, user)
    } else {
        return storageService.post(STORAGE_KEY, user)
    }
}

function getDefaultFilter() {
    return {
        fullname: "",
        username: "",
        score: "",
    }
}