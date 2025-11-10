import { userService as localService } from "./user.service.local.js"
import { userService as remoteService } from "./user.service.remote.js"

const isRemote = true

export const userService = isRemote ? remoteService : localService