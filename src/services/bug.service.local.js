
import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'bugDB'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter
}

function query(filterBy = {}) {
    filterBy = { ...filterBy }

    return storageService.query(STORAGE_KEY)
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
    return storageService.get(STORAGE_KEY, bugId)
}

function remove(bugId) {
    return storageService.remove(STORAGE_KEY, bugId)
}

function save(bug) {
    if (bug._id) {
        return storageService.put(STORAGE_KEY, bug)
    } else {
        return storageService.post(STORAGE_KEY, bug)
    }
}

function getDefaultFilter() {
    return {
        title: '',
        severity: '',
    }
}