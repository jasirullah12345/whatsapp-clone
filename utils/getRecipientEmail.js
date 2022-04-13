export const getRecipientEmail = (users, userLoggedIn) => {
    return users?.filter((user) => {
        return user !== userLoggedIn?.email
    })[0]
}