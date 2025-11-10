import { bugService } from '../services/bug'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { useState } from 'react'
import { useEffect } from 'react'
import { BugFilter } from '../cmps/BugFilter.jsx'


export function BugIndex() {
    const [bugs, setBugs] = useState([])
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [isDownloading, setIsDownloading] = useState(false)

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    async function loadBugs() {
        const bugs = await bugService.query(filterBy)
        setBugs(bugs)
    }

    async function onRemoveBug(bugId) {
        try {
            await bugService.remove(bugId)
            console.log('Deleted Succesfully!')
            setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
            showSuccessMsg('Bug removed')
        } catch (err) {
            console.log('Error from onRemoveBug ->', err)
            showErrorMsg('Cannot remove bug')
        }
    }

    async function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            description: prompt('Bug description?'),
            createdAt: Date.now(),
        }
        try {
            const savedBug = await bugService.save(bug)
            console.log('Added Bug', savedBug)
            setBugs(prevBugs => [savedBug, ...prevBugs,])
            showSuccessMsg('Bug added')
        } catch (err) {
            console.log('Error from onAddBug ->', err)
            showErrorMsg('Cannot add bug')
        }
    }

    async function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const description = prompt('New description?')
        const bugToSave = { ...bug, severity, description }
        try {

            const savedBug = await bugService.save(bugToSave)
            console.log('Updated Bug:', savedBug)
            setBugs(prevBugs => prevBugs.map((currBug) =>
                currBug._id === savedBug._id ? savedBug : currBug
            ))
            showSuccessMsg('Bug updated')
        } catch (err) {
            console.log('Error from onEditBug ->', err)
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
        <section >
            <h3>Bugs App</h3>
            <main>
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <button
                    onClick={onDownloadBugs}
                    disabled={isDownloading}
                >
                    {isDownloading ? 'Downloading...' : 'Download Bug Report 📃'}
                </button>
                <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </section>
    )
}
