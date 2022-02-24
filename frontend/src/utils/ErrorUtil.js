export async function extractErrorMessage(error) {
    // If the network is unreachable
    if (typeof error.response === 'undefined') {
        return error;
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
