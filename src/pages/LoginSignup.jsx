import { useContext, useEffect, useState } from "react"
import { UserContext } from "../contexts/UserContext"
import { userService } from "../services/user"
import { useLocation, useNavigate } from "react-router"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"

export function LoginSignup() {
    const location = useLocation()
    const [isLogin, setIsLogin] = useState(location.pathname === "/login")
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const navigate = useNavigate()
    const { setLoggedinUser } = useContext(UserContext)

    useEffect(() => {
        setIsLogin(location.pathname === "/login")
        clearState()
    }, [location.pathname])

    function handleChange({ target }) {
        const { name: field, value } = target
        setCredentials(prevData => ({ ...prevData, [field]: value }))
    }


    async function onSubmit(ev) {
        ev.preventDefault()
        if (isLogin) {
            if (!credentials.username || !credentials.password) return
            try {
                const user = await userService.login(credentials)
                setLoggedinUser(user)
                showSuccessMsg(`Welcome back ${user.fullname}`)
                navigate("/bug")
            } catch (error) {
                console.log(error)
                showErrorMsg("Invalid credentials")
                navigate("/login")
            }
        } else {
            if (!credentials.username || !credentials.password || !credentials.fullname) return
            try {
                const user = await userService.signup(credentials)
                setLoggedinUser(user)
                showSuccessMsg(`Welcome ${user.fullname}`)
                navigate("/bug")
            } catch (error) {
                console.log(error)
                showErrorMsg("User already exists")
                navigate("/login")
            }
        }

        clearState()
    }

    function toggleLogin() {
        if (isLogin) {
            navigate("/signup")
        } else {
            navigate("/login")
        }
    }

    function clearState() {
        setCredentials(userService.getEmptyUser())
    }

    const { username, password, fullname } = credentials

    return (
        <section className='login-signup'>
            <div className="login-signup-container">
                <h2>{isLogin ? 'Login' : 'Signup'}</h2>
                <button type="button" onClick={toggleLogin}>
                    {isLogin ? "Do not have an account?" : "Already have an account?"}
                </button>
                <form className="login-signup-form" onSubmit={onSubmit}>
                    <div className="form-field">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={username}
                            onChange={handleChange}
                            placeholder="Username"
                        />
                    </div>
                    {
                        !isLogin &&
                        <div className="form-field">
                            <label htmlFor="fullname">Full Name</label>
                            <input
                                name="fullname"
                                type="text"
                                value={fullname}
                                onChange={handleChange}
                                placeholder="Full Name"
                            />
                        </div>
                    }
                    <div className="form-field">
                        <label htmlFor="password">Password</label>
                        <input
                            name="password"
                            type="text"
                            value={password}
                            onChange={handleChange}
                            placeholder="Password"
                        />
                    </div>
                    <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
                </form>
            </div>
        </section>
    )
}