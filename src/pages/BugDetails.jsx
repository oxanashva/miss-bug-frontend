
import { useState } from 'react'
import { bugService } from '../services/bug'
import { showErrorMsg } from '../services/event-bus.service.js'
import { useNavigate, useParams } from 'react-router'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userService } from '../services/user'


export function BugDetails() {
    const [limitExceeded, setLimitExceeded] = useState(false)
    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    const navigate = useNavigate()
    const loggedinUser = userService.getLoggedinUser()

    useEffect(() => {
        if (!loggedinUser) {
            navigate("/login")
        } else {
            loadBug()
        }
    }, [])

    async function loadBug() {
        try {
            const bug = await bugService.getById(bugId)
            setBug(bug)
        } catch (err) {
            if (err.response.status === 401) {
                setLimitExceeded(true)
                showErrorMsg(err.response.data)
            } else {
                showErrorMsg('Cannot load bug')
            }
        }
    }

    if (limitExceeded) {
        return (
            <div className="bug-details main-layout">
                <h2>Access Denied 🚫</h2>
                <p>You must be authorized to view this bug.</p>
                <p><Link to="/bug">Back to List</Link></p>
            </div>
        )
    }


    if (!bug) return <h1>loadings....</h1>

    return <section className="bug-details">
        <h2>Bug Details 🐛</h2>
        <h3>{bug.title}</h3>
        <p>Severity: <span>{bug.severity}</span></p>
        <p>Description: <span>{bug.description}</span></p>
        <p><Link to="/bug">Back to List</Link></p>
    </section>

}

