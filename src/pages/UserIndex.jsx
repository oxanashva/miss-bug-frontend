import { useEffect, useState } from "react"
import { UserList } from "../cmps/UserList"
import { userService } from "../services/user"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"


export function UserIndex() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        loadUsers()
    }, [users])

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

    async function onEdit(userId) {
        const newScoreInput = prompt('New score? (Enter a number)')

        if (newScoreInput === null || newScoreInput.trim() === '') {
            return
        }
        const score = +newScoreInput

        const newIsAdminInput = prompt('New isAdmin? (Enter true or false)')

        if (newIsAdminInput === null || newIsAdminInput.trim() === '') {
            return
        }
        const isAdmin = newIsAdminInput === 'true' ? true : false

        const userToSave = {
            _id: userId,
            score,
            isAdmin
        }

        try {
            const savedUser = await userService.save(userToSave)
            setUsers(prevUsers => prevUsers.map(user => user._id === savedUser._id ? savedUser : user))
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