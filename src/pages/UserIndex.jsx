import { useEffect, useState } from "react"
import { UserList } from "../cmps/UserList"
import { userService } from "../services/user"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"


export function UserIndex() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        const users = await userService.query()
        setUsers(users)
    }

    async function onRemove(userId) {
        try {
            await userService.remove(userId)
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId))
            showSuccessMsg('User removed')
        } catch (error) {
            showErrorMsg('Cannot remove user')
        }
    }

    async function onEdit(user) {
        const newScoreInput = prompt('New score? (Enter a number)')

        if (newScoreInput === null || newScoreInput.trim() === '') {
            return
        }
        const score = +newScoreInput

        const newIsAdminInput = confirm('New isAdmin?')

        if (newIsAdminInput === null) {
            return
        }
        const isAdmin = newIsAdminInput === 'true' ? true : false

        const userToSave = {
            ...user,
            score,
            isAdmin
        }

        try {
            const savedUser = await userService.save(userToSave)
            setUsers(prevUsers => prevUsers.map(u => u._id === savedUser._id ? savedUser : u))
            showSuccessMsg('User updated')
        } catch (error) {
            showErrorMsg('Cannot update user')
        }
    }

    return (
        <section>
            <h2>Users</h2>
            <main>
                <UserList users={users} onRemove={onRemove} onEdit={onEdit} />
            </main>
        </section>
    )
}