import { useRef, useState } from "react"
import { useEffectUpdate } from "../customHooks/useEffectUpdate"
import { utilService } from "../services/util.service"

export function BugFilter({ filterBy, onSetFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const onSetFilterDebounce = useRef(utilService.debounce(onSetFilterBy, 300)).current

    useEffectUpdate(() => {
        onSetFilterDebounce(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        let { value, name: field, type } = target
        if (type === "number") {
            value = value === "" ? "" : +value
        }
        if (type === "select-multiple") {
            value = Array.from(target.options).filter(option => option.selected).map(option => option.value)
        }
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    // TODO: https://mui.com/material-ui/react-select/#multiple-select
    const labels = [
        "ui-bug",
        "need-CR",
        "backend",
        "critical",
        "dev-branch"
    ]

    return <section className="bug-filter">
        <h2>Filter By</h2>
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
        <div className="filter-wrapper">
            <label htmlFor="labels">Labels </label>
            <select
                id="labels"
                name="labels"
                value={filterByToEdit.labels}
                placeholder="Search by labels"
                multiple
                onChange={handleChange}
            >
                {labels.map(label => <option key={label} value={label}>{label}</option>)}
            </select>
        </div>
    </section>
}