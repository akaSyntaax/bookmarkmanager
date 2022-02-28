/**
 * Parses the given error object and performs a logout when the token is invalid. After that, an error message is returned.
 * @param error The catched error object
 * @returns {Promise<string|*>} An error message
 */
export async function handleRequestError(error) {
    // If the network is unreachable
    if (typeof error.response === 'undefined') {
        console.log(error);
        return error;
    }

    console.error(error, error.response);

    // If the jwt token is invalid or expired
    if (error.response.status === 401) {
        if (window.location.pathname === "/") {
            localStorage.removeItem("bearerToken");
            return "Your session has expired";
        }
    }

    try {
        let parsedErrorBody = await error.response.json();

        if (typeof parsedErrorBody.error !== 'undefined') {
            return parsedErrorBody.error;
        } else {
            return error.response.statusText;
        }
    } catch (e) {
        return error.response.statusText;
    }
}
