

export function BugPreview({ bug }) {

    return <article >
        <h3>{bug.title}</h3>
        <h1>🐛</h1>
        <p>Severity: <span>{bug.severity}</span></p>
    </article>
}