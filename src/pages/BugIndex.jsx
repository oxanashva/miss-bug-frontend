import { useState, useEffect } from 'react'
import { bugService } from '../services/bug'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user'
import { useNavigate } from 'react-router'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'


export function BugIndex() {
    const [bugs, setBugs] = useState([])
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [isDownloading, setIsDownloading] = useState(false)

    const navigate = useNavigate()
    const loggedinUser = userService.getLoggedinUser()

    useEffect(() => {
        if (!loggedinUser) {
            navigate('/login')
        } else {
            loadBugs()
        }
    }, [filterBy])

    async function loadBugs() {
        const bugs = await bugService.query(filterBy)
        setBugs(bugs)
    }

    async function onRemoveBug(bugId) {
        try {
            await bugService.remove(bugId)
            setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
            showSuccessMsg('Bug removed')
        } catch (err) {
            showErrorMsg('Cannot remove bug')
        }
    }

    async function onAddBug() {
        const title = prompt('Bug title?')
        if (title === null) return

        const severityInput = prompt('Bug severity? (Enter a number)')
        if (severityInput === null) return
        const severity = +severityInput

        const description = prompt('Bug description?')
        if (description === null) return

        const bug = {
            title,
            severity,
            description,
        }

        try {
            const savedBug = await bugService.save(bug)
            setBugs(prevBugs => [savedBug, ...prevBugs])
            showSuccessMsg('Bug added')
        } catch (err) {
            showErrorMsg('Cannot add bug')
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
            setBugs(prevBugs => prevBugs.map((currBug) =>
                currBug._id === savedBug._id ? savedBug : currBug
            ))
            showSuccessMsg('Bug updated')
        } catch (err) {
            showErrorMsg('Cannot update bug')
        }
    }

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilterBy => ({ ...prevFilterBy, ...filterBy }))
    }

    const onDownloadBugs = async () => {
        setIsDownloading(true)

        try {
            // Get the response object, not just res.data
            const response = await bugService.downloadBugs()
            const blob = response.data

            // 1. Create a dynamic filename (e.g., 'Bugs_Report_2025-11-10.pdf')
            const now = new Date()
            const dateString = now.toLocaleDateString("en-CA").replace(/-/g, '_')
            const filename = `Bugs_Report_${dateString}.pdf`

            // 2. Create the Blob URL
            const url = window.URL.createObjectURL(blob)

            // 3. Create and set up the temporary <a> element
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', filename) // Set filename

            // 4. Trigger the download
            document.body.appendChild(link)
            link.click()

            // 5. Clean up
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

        } catch (err) {
            showErrorMsg("Failed to download the report")
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <section className="bug-index">
            <h2>Bugs App</h2>
            <main>
                <button
                    className="add-bug"
                    onClick={onAddBug}
                >
                    Add Bug ⛐
                </button>
                <button
                    onClick={onDownloadBugs}
                    disabled={isDownloading}
                >
                    {isDownloading ? 'Downloading...' : 'Download Bug Report 📃'}
                </button>
                <div className="paging">
                    <label htmlFor="paging">Use Paging</label>
                    <input id="paging" type="checkbox" />
                </div>

                <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} loggedinUser={loggedinUser} />
            </main>
        </section>
    )
}
