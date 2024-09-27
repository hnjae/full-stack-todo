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

# check existing user
POST http://localhost:3000/users
content-type: application/json
{
  "email": "example@example.com",
  "password": "example"
}
HTTP 409

# check if some information missing
POST http://localhost:3000/users
content-type: application/json
{
  "email": "example{{random_int_number}}@example{{random_int_number}}.com"
}
HTTP 400

# check-validation-pipe
POST http://localhost:3000/users
content-type: application/json
{
  "email": "not-an-email",
  "password": "example"
}
HTTP 400

GET http://localhost:3000/users/example@example.com
HTTP 200

GET http://localhost:3000/users/example{{random_int_number}}@example{{random_int_number}}.com
HTTP 404

PUT http://localhost:3000/users/example@example.com
content-type: application/json
{
  "email": "example{{random_int_number}}@example{{random_int_number}}.com",
  "password": "example2"
}
HTTP 200

# user-does-not-exists
PUT http://localhost:3000/users/example{{random_int_number}}@example{{random_int_number}}.com
content-type: application/json
{
  "email": "example@example.com",
  "password": "example"
}
HTTP 404

# user-does-not-exists
DELETE http://localhost:3000/users/example{{random_int_number}}@example{{random_int_number}}.com
