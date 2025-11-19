import { useEffect, useState } from "react"
import { bugService } from "../services/bug/bug.service.remote"
import { BugList } from "../cmps/BugList"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"
import { userService } from "../services/user"

export function UserDetails() {
    const loggedinUser = userService.getLoggedinUser()
    const [userBugs, setUserBugs] = useState([])

    useEffect(() => {
        loadUserBugs()
    }, [])

    async function loadUserBugs() {
        try {
            const bugs = await bugService.query()
            const loggedinUserBugs = bugs.filter(bug => bug.creator._id === loggedinUser._id)
            setUserBugs(loggedinUserBugs)
        } catch (error) {
            showErrorMsg('Cannot load bugs')
        }
    }

    async function onRemoveBug(bugId) {
        try {
            await bugService.remove(bugId)
            setUserBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
            showSuccessMsg('Bug removed')
        } catch (err) {
            showErrorMsg('Cannot remove bug')
        }
    }

    async function onEditBug(bug) {
        const newSeverityInput = prompt('New severity? (Enter a number)')

        if (newSeverityInput === null || newSeverityInput.trim() === '') {
            return
        }
        const severity = +newSeverityInput

        const description = prompt('New description?')

        if (description === null || description.trim() === '') {
            return
        }

        const bugToSave = {
            _id: bug._id,
            severity,
            description
        }

        try {
            const savedBug = await bugService.save(bugToSave)
            setUserBugs(prevBugs => prevBugs.map((currBug) =>
                currBug._id === savedBug._id ? savedBug : currBug
            ))
            showSuccessMsg('Bug updated')
        } catch (err) {
            showErrorMsg('Cannot update bug')
        }
    }

    const { fullname, score } = loggedinUser
    return (
        <section className="user-details">
            <h2>Welcome {fullname}!</h2>
            <p>Your score: {score}</p>
            {userBugs.length === 0 && <p>No bugs yet</p>}
            {userBugs.length > 0 && <h3>Bugs created by you:</h3>}
            {userBugs.length > 0 && <BugList bugs={userBugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} loggedinUser={loggedinUser} />}
        </section>
    )
} 