/*
Declare all of the possible types of JSON objects
that we could find in the body of requests
*/

use rocket::request::{self, FromRequest, Request};

#[derive(Debug)]
pub struct JsonWebToken(String);

impl<'a, 'r> FromRequest<'a, 'r> for JsonWebToken {
    type Error = !;

    fn from_request(request: &'a Request<'r>) -> request::Outcome<JsonWebToken, !> {
        true;  // TODO: JWT auth request guard
    }
}

#[derive(Serialize, Deserialize)]
pub struct Code {
    phone: String
}

#[derive(Serialize, Deserialize)]
pub struct VerifyPhone {
    phone: String,
    code: String
}

#[derive(Serialize, Deserialize)]
pub struct EmailToken {
    email: String,
    password: String
}

#[derive(Serialize, Deserialize)]
pub struct PhoneToken {
    email: String,
    password: String
}

#[derive(Serialize, Deserialize)]
pub struct UsernameToken {
    username: String,
    password: String
}

#[derive(Serialize, Deserialize)]
pub struct Token {
    token: JsonWebToken
}
