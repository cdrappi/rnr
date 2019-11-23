import { API_HOST } from "./api";
import { postAuthJson } from "./util";

function checkValidInputs(usernameInput, passwordInput) {
    if (usernameInput && passwordInput) {
        return { valid: true };
    } else {
        let message = "";
        if (!usernameInput && !passwordInput) {
            message = "Username and password cannot be blank";
        } else if (!usernameInput) {
            message = "Username cannot be blank";
        } else if (!passwordInput) {
            message = "Password cannot be blank";
        }
        return { valid: false, message: message };
    }
}

function fetchSendCode(phone) {
    // phone, e.g. "17327706758" (no leading "+")
    return postAuthJson(`${API_HOST}/code/`, "POST", { phone: phone });
}

function fetchVerifyPhone(phone, code) {
    // phone (str) e.g. "17327706758" (no leading "+")
    // code (str) e.g. '01234'
    return postAuthJson(`${API_HOST}/verify/`, "POST", { phone: phone, code: code });
}

function fetchTokenUsername(username, password) {
    return fetchToken("username", { username: username, password: password })
}

function fetchTokenEmail(email, password) {
    return fetchToken("email", { email: email, password: password })
}

function fetchTokenPhone(phone, password) {
    return fetchToken("phone", { phone: phone, password: password })
}

function fetchToken(loginType, jsonBody) {
    return postAuthJson(`${API_HOST}/jwt/${loginType}/`, jsonBody)
}

export { checkValidInputs, fetchCreateUser, fetchTokenEmail, fetchTokenPhone, fetchTokenUsername, fetchVerifyPhone, fetchSendCode };