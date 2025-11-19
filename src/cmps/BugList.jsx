
import { Link } from 'react-router-dom'
import { BugPreview } from './BugPreview'

export function BugList({ bugs, onRemoveBug, onEditBug, loggedinUser }) {

    function checkBugCreator(bug) {
        return bug.creator._id === loggedinUser._id || loggedinUser.isAdmin
    }

    return (
        <ul className="bug-list">
            {bugs.map((bug) => (
                <li className="bug-preview" key={bug._id}>
                    <BugPreview bug={bug} />
                    {checkBugCreator(bug) &&
                        <div>
                            <button
                                onClick={() => {
                                    onRemoveBug(bug._id)
                                }}
                            >
                                x
                            </button>
                            <button
                                onClick={() => {
                                    onEditBug(bug)
                                }}
                            >
                                Edit
                            </button>
                        </div>
                    }
                    <Link to={`/bug/${bug._id}`} className="details-btn">Details</Link>
                </li>
            ))}
        </ul>
    )
}
