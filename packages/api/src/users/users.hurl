###############################################################################
# Get/Generate required resources
###############################################################################

# Create a new user
POST http://{{host}}/auth/register
content-type: application/json
[Options]
variable: host = "localhost:3000"
variable: password = "example"
{
  "email": "{{newUuid}}@example.com",
  "password": "{{password}}"
}
HTTP 201
[Captures]
userId: jsonpath "$.id"
email: jsonpath "$.email"

# Create a 2nd user
POST http://{{host}}/auth/register
content-type: application/json
[Options]
variable: password2 = "example"
{
  "email": "{{newUuid}}@example.com",
  "password": "{{password}}"
}
HTTP 201
[Captures]
userId2: jsonpath "$.id"
email2: jsonpath "$.email"

# Query tokens
POST http://{{host}}/auth/token
content-Type: application/x-www-form-urlencoded
[FormParams]
grant_type: password
username: {{email}}
password: {{password}}
HTTP 200
[Captures]
accessToken: jsonpath "$.access_token"
refreshToken: jsonpath "$.refresh_token"
tokenType: jsonpath "$.token_type"

# Query tokens for 2nd user
POST http://{{host}}/auth/token
content-Type: application/x-www-form-urlencoded
[FormParams]
grant_type: password
username: {{email2}}
password: {{password2}}
HTTP 200
[Captures]
accessToken2: jsonpath "$.access_token"
refreshToken2: jsonpath "$.refresh_token"
tokenType2: jsonpath "$.token_type"

###############################################################################
# Test APIs
###############################################################################

# without token
GET http://{{host}}/users/{{userId}}
HTTP 401

# with wrong token
GET http://{{host}}/users/{{userId}}
Authorization: {{tokenType}} foo
HTTP 401

# access with other user's token
GET http://{{host}}/users/{{userId}}
Authorization: {{tokenType2}} {{accessToken2}}
HTTP 403

# access with user's own token
GET http://{{host}}/users/{{userId}}
Authorization: {{tokenType}} {{accessToken}}
HTTP 200

# update user
PUT http://{{host}}/users/{{userId}}
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
[Options]
variable: newEmail = "{{newUuid}}@example.org"
{
  "email": "{{newEmail}}"
}
HTTP 200
[Asserts]
jsonpath "$.email" == "{{newEmail}}"

# update user with existing email
PUT http://{{host}}/users/{{userId}}
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
{
  "email": "{{email2}}"
}
HTTP 409

# test class-validator
PUT http://{{host}}/users/{{userId}}
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
{
  "email": "foo"
}
HTTP 400

# test class-validator
PUT http://{{host}}/users/{{userId}}
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
{
  "password": ""
}
HTTP 400

DELETE http://{{host}}/users/{{userId}}
Authorization: {{tokenType}} {{accessToken}}
HTTP 200

DELETE http://{{host}}/users/{{userId2}}
Authorization: {{tokenType2}} {{accessToken2}}
HTTP 200

# delete non-existing user
DELETE http://{{host}}/users/{{userId}}
Authorization: {{tokenType}} {{accessToken}}
HTTP 404
