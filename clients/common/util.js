function fetchAuthJson(method, url, obj) {
    return fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj)
    });
}

function fetchJson(method, url, obj, jwt) {
    return fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${jwt}`
        },
        body: JSON.stringify(obj)
    });
}

const getAuthJson = (url, obj) => fetchAuthJson("GET", url, obj);
const postAuthJson = (url, obj) => fetchAuthJson("POST", url, obj);
const getJson = (url, obj, token) => fetchJson("GET", url, obj, token);
const postJson = (url, obj, token) => fetchJson("POST", url, obj, token);

export { getAuthJson, getJson, postJson, postAuthJson };