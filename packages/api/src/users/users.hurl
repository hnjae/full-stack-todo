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

POST http://localhost:3000/users
content-type: application/json
{
  "email": "example@example.org",
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

GET http://localhost:3000/users/6ffd082f-eae9-4b2b-9156-57f20a601a86
HTTP 200

GET http://localhost:3000/users/00000000-0000-0000-0000-000000000000
HTTP 404

# PUT http://localhost:3000/users/<uuid>
# content-type: application/json
# {
#   "email": "example{{random_int_number}}@example{{random_int_number}}.com",
#   "password": "example2"
# }
# HTTP 200

# user-does-not-exists
PUT http://localhost:3000/users/00000000-0000-0000-0000-000000000000
content-type: application/json
{
  "email": "example@example.com",
  "password": "example"
}
HTTP 404

# user-does-not-exists
DELETE http://localhost:3000/users/00000000-0000-0000-0000-000000000000
HTTP 404
