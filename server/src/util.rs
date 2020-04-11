use std::{env, time::SystemTime};

use rocket::http::{ContentType, Status};
use rocket::request::Request;
use rocket::response;
use rocket::response::{Body, Responder, Response};
use rocket_contrib::json::JsonValue;
use std::io::Cursor;

pub fn expect_env(name: &str) -> String {
    return env::var(name).expect(&format!("Missing `{}` env variable", name));
}

pub fn now_seconds() -> u64 {
    SystemTime::now()
        .duration_since(SystemTime::UNIX_EPOCH)
        .expect("SystemTime before UNIX Epoch!")
        .as_secs()
}

pub fn to_string(value: &Option<String>) -> String {
    value.as_ref().unwrap_or(&"".to_string()).to_string()
}

#[derive(Debug)]
pub struct JsonResponse {
    pub status: Status,
    pub json: JsonValue,
}

impl JsonResponse {
    pub fn ok(json: JsonValue) -> Self {
        JsonResponse {
            status: Status::Ok,
            json: json,
        }
    }

    pub fn err400(json: JsonValue) -> Self {
        JsonResponse {
            status: Status::BadRequest,
            json: json,
        }
    }

    pub fn err500(json: JsonValue) -> Self {
        JsonResponse {
            status: Status::InternalServerError,
            json: json,
        }
    }
}

impl<'r> response::Responder<'r> for JsonResponse {
    fn respond_to(self, req: &Request) -> response::Result<'r> {
        response::Response::build_from(self.json.respond_to(&req).unwrap())
            .status(self.status)
            .header(ContentType::JSON)
            .ok()
    }
}
