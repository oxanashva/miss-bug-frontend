import { useEffect, useState } from "react"
import { UserList } from "../cmps/UserList"
import { userService } from "../services/user"


export function UserIndex() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        const users = await userService.query()
        setUsers(users)
    }

    return (
        <section>
            <h3>Users</h3>
            <main>
                <UserList users={users} />
            </main>
        </section>
    )
}