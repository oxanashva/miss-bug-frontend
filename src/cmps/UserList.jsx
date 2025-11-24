import { UserPreview } from "./UserPreview"


export function UserList({ users, onRemove, onEdit }) {
    return (
        <ul className="user-list">
            <li className="user-item user-header">
                <p>Fullname</p>
                <p>Username</p>
                <p>Score</p>

            </li>
            {users.map((user) => (
                <li key={user._id} className="user-item">
                    <UserPreview user={user} />
                    <button onClick={() => onEdit(user)}>🖋️</button>
                    <button onClick={() => onRemove(user._id)}>❌</button>
                </li>
            ))}
        </ul>
    )
}