import { useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import { userService } from '../services/user'
import { NavLink, useNavigate } from 'react-router-dom'
import { UserMsg } from './UserMsg'

export function AppHeader() {
    const { loggedinUser, setLoggedinUser } = useContext(UserContext)
    const navigate = useNavigate()

    function onLogout() {
        userService.logout()
        setLoggedinUser(null)
        navigate("/login")
    }

    return (
        <header className='app-header container full'>
            <div className='header-container'>
                <h1>Bugs are Forever</h1>
                <nav className='app-nav'>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <NavLink to="/bug">Bugs</NavLink>
                    {loggedinUser?.isAdmin && <NavLink to="/user">Users</NavLink>}
                    {loggedinUser && <NavLink className="avatar" to={`/user/${loggedinUser._id}`}>
                        <img src={loggedinUser.imgUrl} alt="avatar" />
                        {loggedinUser.fullname}
                    </NavLink>}
                    {loggedinUser ? <button onClick={onLogout}>Logout</button> : <NavLink className="link-btn" to="/login">Login</NavLink>}
                </nav>
            </div>
            <UserMsg />
        </header>
    )
}
