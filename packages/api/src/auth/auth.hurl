POST http://localhost:3000/auth/register
content-type: application/json
{
  "email": "example{{random_int_number}}@example{{random_int_number}}.com",
  "password": "example"
}
HTTP 201

POST http://localhost:3000/auth/register
content-type: application/json
{
  "email": "example@example.com",
  "password": "example"
}

# password-empty
POST http://localhost:3000/auth/register
content-type: application/json
{
  "email": "example{{random_int_number}}@example{{random_int_number}}.com"
}
HTTP 400

# email-empty
POST http://localhost:3000/auth/register
content-type: application/json
{
  "password": "example"
}
HTTP 400

POST http://localhost:3000/auth/login
content-type: application/json
{
  "email": "not-exist-example{{random_int_number}}@example{{random_int_number}}.com",
  "password": "example"
}
HTTP 401

POST http://localhost:3000/auth/login
content-type: application/json
{
  "email": "example@example.com",
  "password": "example"
}
HTTP 200
