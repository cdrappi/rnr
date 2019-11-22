extern crate jsonwebtoken as jwt;
#[macro_use]
extern crate serde_derive;

use jwt::errors::ErrorKind;
use jwt::{decode, encode, Header, Validation};

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    phone: String,
    email: String,
    username: String,
    exp: usize,
}

fn validate(key: String, phone: String) {
    let validation = Validation { phone: phone, ..Validation::default() };
    return decode::<Claims>(&token, key, &Validation::default())?;
    let token_data = match decode::<Claims>(&token, key.as_ref(), &validation) {
        Ok(c) => c,
        Err(err) => match *err.kind() {
            ErrorKind::InvalidToken => panic!("Token is invalid"), // Example on how to handle a specific error
            ErrorKind::InvalidIssuer => panic!("Issuer is invalid"), // Example on how to handle a specific error
            _ => panic!("Some other errors"),
        },
    };
}

fn encodeToken(key: &String, keyId: str, phone: String, exp: usize) {
    let mut header = Header::default();
    header.kid = Some(keyId);
    header.alg = Algorithm::HS512;

    let mut my_claims = Claims {phone: phone, exp: exp};
    let token = encode(&header, &my_claims, key)?;
}

fn decodeToken(key: &String) {
    let token = decode::<Claims>(&token, "secret".as_ref(), &Validation::default())?;
}

fn main() {
    let my_claims =
        Claims { sub: "b@b.com".to_owned(), company: "ACME".to_owned(), exp: 10000000000 };
    let key = "secret";
    let token = match encode(&Header::default(), &my_claims, key.as_ref()) {
        Ok(t) => t,
        Err(_) => panic!(), // in practice you would return the error
    };

    println!("{:?}", token_data.claims);
    println!("{:?}", token_data.header);
}

/*
encoded = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBob25lIn0.eyJzdWIiOjEyMzQ1Njc4OTAsInBob25lIjoiMTczMjc3MDY3NTgiLCJ1c2VybmFtZSI6ImRydW5rb25wYXBweSIsImVtYWlsIjoiY2hyaXN0aWFuZHJhcHBpQGdtYWlsLmNvbSIsImV4cCI6MTUxNjIzOTAyMn0.le6oEOsAsS65BpcJf8R6yDSONiocjWlrgJDy4bVXK60'

header = {
  "alg": "HS256",
  "typ": "JWT",
  "kid": "phone"
}

claims = {
  "sub": 1234567890,
  "phone": "17327706758",
  "username": "drunkonpappy",
  "email": "christiandrappi@gmail.com",
  "exp": 1516239022
}

HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  "password"
)

*/
