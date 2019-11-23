const productionUrl = "https://react-native-rocket.herokuapp.com";
const stagingUrl = "https://react-native-rocket.herokuapp.com";
const localhost = "http://127.0.0.1:8000";

const mode = process.env.NODE_ENV || "local";
const hostname = window && window.location && window.location.hostname;

let API_HOST;
if (mode === "production") {
    API_HOST = productionUrl;
} else if (mode === "staging") {
    API_HOST = stagingUrl;
} else {
    API_HOST = localhost;
}

export { API_HOST };