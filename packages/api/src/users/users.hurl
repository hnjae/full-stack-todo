GET http://localhost:3000/users
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

# without token
GET http://localhost:3000/users/00000000-0000-0000-0000-000000000000
HTTP 401

# wrong token
GET http://localhost:3000/users/00000000-0000-0000-0000-000000000000
Authorization: Bearer foo
HTTP 401

# user example@example.com
GET http://localhost:3000/users/6ffd082f-eae9-4b2b-9156-57f20a601a86
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ZmZkMDgyZi1lYWU5LTRiMmItOTE1Ni01N2YyMGE2MDFhODYiLCJpYXQiOjE3Mzg2NjYxMzIsImV4cCI6MTczODc1MjUzMn0.7bxmwrPm9U0OQ4TKn05W5_gP-LtG1e5ZVevVdeMlxWc
HTTP 200

# user example@example.org
GET http://localhost:3000/users/9bf9592f-cd35-425c-93cd-445a033c1246
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YmY5NTkyZi1jZDM1LTQyNWMtOTNjZC00NDVhMDMzYzEyNDYiLCJpYXQiOjE3Mzg2NjYyMDUsImV4cCI6MTczODc1MjYwNX0.-_LmbAkELn5-5nLdAZST1u6mufMwiCsflKXT6Mnt8Ig

# access example@example.org's resource with example@example.com's resources
GET http://localhost:3000/users/9bf9592f-cd35-425c-93cd-445a033c1246
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ZmZkMDgyZi1lYWU5LTRiMmItOTE1Ni01N2YyMGE2MDFhODYiLCJpYXQiOjE3Mzg2NjYxMzIsImV4cCI6MTczODc1MjUzMn0.7bxmwrPm9U0OQ4TKn05W5_gP-LtG1e5ZVevVdeMlxWc
HTTP 403

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
