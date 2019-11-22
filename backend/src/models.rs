use diesel::{self, prelude::*};
use diesel::result::Error;

mod schema;

use self::schema::users;

#[derive(Queryable, Debug)]
pub struct User {
    pub id: i32,
    pub username: String,
}

use self::schema::users::dsl::{username as users_uname, users as all_users};

#[derive(Deserialize)]
pub struct Ballot {
    pub votes: Vec<i32>,
}

#[table_name = "users"]
#[derive(FromForm, Insertable)]
pub struct NewUser {
    pub username: String,
}

impl NewUser {
    pub fn login(self, conn: &PgConnection) -> Result<User, Error> {
        // ensure that the user exists
        let _ = diesel::insert_into(self::schema::users::table)
            .values(&self)
            .execute(conn);

        all_users
            .filter(users_uname.eq(&self.username))
            .get_result::<User>(conn)
    }
}
