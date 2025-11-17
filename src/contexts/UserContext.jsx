import { createContext, useState, useEffect } from "react"
import { userService } from "../services/user/user.service.remote.js"

export const UserContext = createContext()

export function UserProvider({ children }) {
    const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser())

    useEffect(() => {
        const user = userService.getLoggedinUser()
        setLoggedinUser(user)
    }, [])

    return (
        <UserContext.Provider value={{ loggedinUser, setLoggedinUser }}>
            {children}
        </UserContext.Provider>
    )
}