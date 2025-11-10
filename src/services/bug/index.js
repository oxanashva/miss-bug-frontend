import { bugService as localService } from "./bug.service.local.js"
import { bugService as remoteService } from "./bug.service.remote.js"

const isRemote = true

export const bugService = isRemote ? remoteService : localService