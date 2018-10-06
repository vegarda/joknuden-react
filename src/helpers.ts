export function handleResponseErrors(response: Response) {
    if (!response.ok) {
        console.log(response);
        throw new Error(response.statusText);
    }
    return response;
}
