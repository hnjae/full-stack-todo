GET http://localhost:3000/users/all
HTTP 200

POST http://localhost:3000/users
content-type: application/json
{
  "email": "example{{random_int_number}}@example{{random_int_number}}.com",
  "password": "example"
}
HTTP 201

POST http://localhost:3000/users
content-type: application/json
{
  "email": "example@example.com",
  "password": "example"
}
HTTP 409
