use diesel::{self, prelude::*};
use diesel::result::Error;

mod schema;

#[derive(Queryable, Debug)]
pub struct User {
    pub id: i32,
    pub phone: String,
    pub username: String,
    pub email: String,
}

use self::schema::users::dsl::{users, users_uphone}; // TODO: why?

#[table_name = "users"]
#[derive(FromForm, Insertable)]
pub struct NewUser {
    pub phone: String,
    pub password: String,
}

impl NewUser {
    pub fn login(self, conn: &PgConnection) -> Result<User, Error> {
        // ensure that the user exists
        let _ = diesel::insert_into(self::schema::users::table)
            .values(&self)
            .execute(conn);

        users
            .filter(users_uphone.eq(&self.phone))
            .get_result::<User>(conn)
    }
}
