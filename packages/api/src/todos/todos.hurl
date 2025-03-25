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

# Create a new todo list
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

###############################################################################
# Test APIs
###############################################################################

# test worng token
GET http://{{host}}/users/{{userId}}/todos
Authorization: {{tokenType}} foo
HTTP 401

# test other user token
GET http://{{host}}/users/{{userId}}/todos
Authorization: {{tokenType2}} {{accessToken2}}
HTTP 403

GET http://{{host}}/users/{{userId}}/todos
Authorization: {{tokenType}} {{accessToken}}
HTTP 200

POST http://{{host}}/users/{{userId}}/todos
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
{
  "title": "Buy milk",
  "completed": false,
  "todoListId": "{{todoListId}}",
  "order": {{random_int_number}}
}
HTTP 201
[Captures]
todoId: jsonpath "$['id']"

# Missing attribute
POST http://{{host}}/users/{{userId}}/todos
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
{
  "todoListId": "{{todoListId}}",
  "completed": false,
  "order": {{random_int_number}}
}
HTTP 400 # BAD_REQUEST

# use invalid todoListId
POST http://{{host}}/users/{{userId}}/todos
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
{
  "title": "Buy milk",
  "completed": false,
  "todoListId": "{{newUuid}}",
  "order": {{random_int_number}}
}
HTTP 400 # BAD_REQUEST

GET http://{{host}}/users/{{userId}}/todos/{{todoId}}
Authorization: {{tokenType}} {{accessToken}}
HTTP 200
[Asserts]
jsonpath "$.id" == "{{todoId}}"

GET http://{{host}}/users/{{userId}}/todos/{{newUuid}}
Authorization: {{tokenType}} {{accessToken}}
HTTP 404 # NOT_FOUND

PUT http://{{host}}/users/{{userId}}/todos/{{todoId}}
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
{
  "completed": true,
  "order": {{random_int_number}}
}
HTTP 200
[Asserts]
jsonpath "$.completed" == true

# use invalid todoListId
PUT http://{{host}}/users/{{userId}}/todos/{{todoId}}
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
{
  "completed": false,
  "todoListId": "{{newUuid}}",
  "order": {{random_int_number}}
}
HTTP 400 # BAD_REQUEST

# no-existing todo
PUT http://{{host}}/users/{{userId}}/todos/{{newUuid}}
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
{
  "completed": false,
  "todoListId": "{{newUuid}}",
  "order": {{random_int_number}}
}
HTTP 404 # NOT_FOUND

DELETE http://{{host}}/users/{{userId}}/todos/{{todoId}}
Authorization: {{tokenType}} {{accessToken}}
HTTP 200

DELETE http://{{host}}/users/{{userId}}/todos/{{todoId}}
Authorization: {{tokenType}} {{accessToken}}
HTTP 404 # NOT_FOUND

###############################################################################
# Clean-up
###############################################################################

DELETE http://{{host}}/users/{{userId}}
Authorization: {{tokenType}} {{accessToken}}
HTTP 200

DELETE http://{{host}}/users/{{userId2}}
Authorization: {{tokenType2}} {{accessToken2}}
