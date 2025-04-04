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

# test worng token
GET http://{{host}}/users/{{userId}}/todo-lists
Authorization: {{tokenType}} foo
HTTP 401

# test other user token
GET http://{{host}}/users/{{userId}}/todo-lists
Authorization: {{tokenType2}} {{accessToken2}}
HTTP 403

# create new todo-list
POST http://{{host}}/users/{{userId}}/todo-lists
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
{
  "name": "{{newUuid}}",
  "order": {{random_int_number}}
}
HTTP 201
[Captures]
todoListId: jsonpath "$['id']"

# create new todo-list with missing arguments
POST http://{{host}}/users/{{userId}}/todo-lists
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
{
  "name": "{{newUuid}}"
}
HTTP 400 # Bad Request

GET http://{{host}}/users/{{userId}}/todo-lists
Authorization: {{tokenType}} {{accessToken}}
HTTP 200
[Asserts]
jsonpath "$[0].id" == "{{todoListId}}"

GET http://{{host}}/users/{{userId}}/todo-lists/{{todoListId}}
Authorization: {{tokenType}} {{accessToken}}
HTTP 200

PATCH http://{{host}}/users/{{userId}}/todo-lists/{{todoListId}}
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
[Options]
variable: newName = "new-name-{{newUuid}}"
{
  "name": "{{newName}}"
}
HTTP 200
[Asserts]
jsonpath "$.name" == "{{newName}}"

# update non-existing todo-list
PATCH http://{{host}}/users/{{userId}}/todo-lists/{{newUuid}}
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
{
  "name": "{{newUuid}}"
}
HTTP 404

DELETE http://{{host}}/users/{{userId}}/todo-lists/{{todoListId}}
Authorization: {{tokenType}} {{accessToken}}
HTTP 200

# delete non-existing todo-list
DELETE http://{{host}}/users/{{userId}}/todo-lists/{{todoListId}}
Authorization: {{tokenType}} {{accessToken}}
HTTP 404

# get non-existing todo-list
GET http://{{host}}/users/{{userId}}/todo-lists/{{todoListId}}
Authorization: {{tokenType}} {{accessToken}}
HTTP 404

###############################################################################
# Clean-up
###############################################################################

DELETE http://{{host}}/users/{{userId}}
Authorization: {{tokenType}} {{accessToken}}
HTTP 200

DELETE http://{{host}}/users/{{userId2}}
Authorization: {{tokenType2}} {{accessToken2}}
HTTP 200
