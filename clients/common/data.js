import { API_HOST } from "./api";
import { postAuthJson } from "./util";

function fetchSelf(token) {
    return postAuthJson(`${API_HOST}/self/`, {}, token)
}

export { fetchSelf };