// extern crate jsonwebtoken as jwt;
// #[macro_use]
// extern crate serde_derive;

use jwt::errors::ErrorKind;
use jwt::{decode, encode, Header, Validation};

#[derive(Debug, Serialize, Deserialize)]
struct FullClaims {
    sub: i32,
    phone: String,
    username: String,
    email: String,
    exp: usize,
}

struct LoginClaims {
    sub: i32,
    exp: usize,
}

fn validateLogin(token: &String, secret_key: String, user_id: i32) -> bool {
    let validation = Validation { user_id: user_id, ..Validation::default() };
    return decode::<Claims>(&token, key.as_ref(), &validation);
}


fn test_claim() {
    let claims = FullClaims {
        sub: 1234567890,
        phone: "17327706758",
        username: "drunkonpappy",
        email: "christiandrappi@gmail.com",
        exp: 1516239022
    };
    let secret_key = "secret";
    let token = encode(&Header::default(), secret_key.as_ref(), &claims);

    match token {
        Ok(t) => {
            println!("{:?}", token_data.claims);
            println!("{:?}", token_data.header);
        },
        Err(err) => match *err.kind() {
            ErrorKind::InvalidToken => panic!("Token is invalid"), // Example on how to handle a specific error
            ErrorKind::InvalidIssuer => panic!("Issuer is invalid"), // Example on how to handle a specific error
            _ => panic!("Some other errors"),
        },
    }
}

/*
encoded = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBob25lIn0.eyJzdWIiOjEyMzQ1Njc4OTAsInBob25lIjoiMTczMjc3MDY3NTgiLCJ1c2VybmFtZSI6ImRydW5rb25wYXBweSIsImVtYWlsIjoiY2hyaXN0aWFuZHJhcHBpQGdtYWlsLmNvbSIsImV4cCI6MTUxNjIzOTAyMn0.le6oEOsAsS65BpcJf8R6yDSONiocjWlrgJDy4bVXK60'

header = {
  "alg": "HS256",
  "typ": "JWT",
  "kid": "phone"
}

claims = 
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  "password"
)


 {
    Ok(c) => c,
    Err(err) => match *err.kind() {
        ErrorKind::InvalidToken => panic!("Token is invalid"), // Example on how to handle a specific error
        ErrorKind::InvalidIssuer => panic!("Issuer is invalid"), // Example on how to handle a specific error
        _ => panic!("Some other errors"),
    },
};
*/
