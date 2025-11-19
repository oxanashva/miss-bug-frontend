

export function UserPreview({ user }) {
    const { fullname, username, score } = user

    return (
        <>
            <p>{fullname}</p>
            <p>{username}</p>
            <p>{score}</p>
        </>
    )
}