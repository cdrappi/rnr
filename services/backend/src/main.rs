#![feature(proc_macro_hygiene, decl_macro)]
#![feature(never_type)]

#[macro_use] extern crate rocket;
#[macro_use] extern crate diesel;
#[macro_use] extern crate serde_derive;
#[macro_use] extern crate rocket_contrib;

mod models;
mod json_bodies;
// mod jwt_auth;

use diesel::PgConnection;
use rocket_contrib::json::{Json};
use rocket::{Rocket};
use json_bodies::{UsernameToken, EmailToken, PhoneToken, Code, Token, VerifyPhone};
// use jwt_auth::{test_claim};

#[database("postgres_database")]
pub struct DbConn(PgConnection);

#[get("/")]
fn index(_conn: DbConn) -> &'static str {
    "hello, world"
}

#[post("/code", data="<body>")]
fn code(body: Json<Code>) {
    return json!({"success": false})
}

#[post("/verify", data="<body>")]
fn verify_phone(body: Json<VerifyPhone>) {
    return json!({"success": false})
}

#[post("/jwt/phone", data="<body>")]
fn token_from_phone(body: Json<PhoneToken>) {
    return json!({"success": true})
}

#[post("/jwt/email", data="<body>")]
fn token_from_email(body: Json<EmailToken>) {
    return json!({"success": true})
}

#[post("/jwt/username", data="<body>")]
fn token_from_username(body: Json<UsernameToken>) {
    return json!({"success": true})
}

#[post("/self", data="<body>")]
fn validate_token(body: Json<Token>)  {
    return json!({"user_id": 0, })
}

fn rocket() -> (Rocket, Option<DbConn>) {
    let rocket = rocket::ignite()
        .attach(DbConn::fairing())
        .mount("/", routes![
            index,
            code,
            verify_phone,
            // 3 ways to login
            token_from_phone,
            token_from_email,
            token_from_username,
            // Check if token works
            validate_token,
        ]);

    let conn = match cfg!(test) {
        true => DbConn::get_one(&rocket),
        false => None,
    };

    (rocket, conn)
}


fn main() {
    // test_claim();
    rocket().0.launch();
}
