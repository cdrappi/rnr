#![feature(proc_macro_hygiene, decl_macro)]
#![feature(never_type)]

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate rocket_contrib;

mod models;

use diesel::PgConnection;
use rocket::http::{Cookie, Cookies};
use rocket::outcome::IntoOutcome;
use rocket::request::{self, Json, FromRequest, Request};
use rocket::Rocket;

use models::{LoggingInUser, NewUser};

#[database("postgres_database")]
pub struct DbConn(PgConnection);

#[derive(Debug)]
struct Auth(i32);


impl<'a, 'r> FromRequest<'a, 'r> for Auth {
    type Error = !;

    fn from_request(request: &'a Request<'r>) -> request::Outcome<Auth, !> {
        request
            .cookies()
            .get_private("user_id")
            .and_then(|cookie| cookie.value().parse().ok())
            .map(|id| Auth(id))
            .or_forward(())
    }
}

#[post("/login", data = "<body>")]
fn login(mut cookies: Cookies, body: Json<NewUser>, conn: DbConn) -> &'static str {
    let user = input.into_inner();
    if user.username.is_empty() {
        index(conn)
    } else {
        match user.login(&conn) {
            Ok(u) => {
                cookies.add_private(Cookie::new("user_id", u.id.to_string()));
                index(conn)
            },
            Err(e) => {
                print!("Error logging in User: {}", e);
                index(conn)
            }
        }
        
    }
}

#[get("/", rank = 2)]
fn index(_conn: DbConn) -> &'static str {
    "hello, world"
}

fn rocket() -> (Rocket, Option<DbConn>) {
    let rocket = rocket::ignite()
        .attach(DbConn::fairing())
        .mount("/", routes![index, login]);

    let conn = match cfg!(test) {
        true => DbConn::get_one(&rocket),
        false => None,
    };

    (rocket, conn)
}


fn main() {
    rocket().0.launch();
}
