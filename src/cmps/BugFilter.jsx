import { useEffect, useRef, useState } from "react"
import { utilService } from "../services/util.service"

export function BugFilter({ filterBy, onSetFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const onSetFilterDebounce = useRef(utilService.debounce(onSetFilterBy, 300)).current

    useEffect(() => {
        onSetFilterDebounce(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        let { value, name: field, type } = target
        if (type === "number") {
            value = value === "" ? "" : +value
        }
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    return <section className="bug-filter">
        <h3>Filter By</h3>
        <div className="filter-wrapper">
            <label htmlFor="title">Title </label>
            <input
                id="title"
                type="text"
                name="title"
                value={filterByToEdit.title}
                placeholder="Search by title"
                onChange={handleChange}
            />
        </div>
        <div className="filter-wrapper">
            <label htmlFor="severity">Severity </label>
            <input
                id="severity"
                type="number"
                name="severity"
                min="1"
                max="4"
                value={filterByToEdit.severity}
                placeholder="Search by severity (1-4)"
                onChange={handleChange}
            />
        </div>
    </section>
}