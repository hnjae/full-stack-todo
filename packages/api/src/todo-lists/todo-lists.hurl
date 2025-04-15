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

##################
# Testing Tokens #
##################

# test invalid token
GET http://{{host}}/users/{{userId}}/todo-lists
Authorization: {{tokenType}} foo
HTTP 401

# test other user token
GET http://{{host}}/users/{{userId}}/todo-lists
Authorization: {{tokenType2}} {{accessToken2}}
HTTP 403

######################################
# Testing todo list Creation/Reading #
######################################

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
todoListId: jsonpath "$.id"
todoListName: jsonpath "$.name"

GET http://{{host}}/users/{{userId}}/todo-lists
Authorization: {{tokenType}} {{accessToken}}
HTTP 200
[Asserts]
jsonpath "$[0].id" == "{{todoListId}}"

GET http://{{host}}/users/{{userId}}/todo-lists/{{todoListId}}
Authorization: {{tokenType}} {{accessToken}}
HTTP 200
[Asserts]
jsonpath "$.id" == "{{todoListId}}"

######################
# Testing validation #
######################

# create new todo-list with missing arguments
POST http://{{host}}/users/{{userId}}/todo-lists
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
{
  "name": "{{newUuid}}"
}
HTTP 400 # Bad Request

###################
# Testing updates #
###################

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

# patching with invalid data
PATCH http://{{host}}/users/{{userId}}/todo-lists/{{todoListId}}
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
[Options]
{
  "order": "foo"
}
HTTP 400

# patching with should-not-exist property
PATCH http://{{host}}/users/{{userId}}/todo-lists/{{todoListId}}
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
[Options]
{
  "foo": "bar"
}
HTTP 400

#########################
# Testing batch updates #
#########################

# create another todo-list
POST http://{{host}}/users/{{userId}}/todo-lists
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
{
  "name": "{{newUuid}}",
  "order": {{random_int_number}}
}
HTTP 201
[Captures]
todoListId2: jsonpath "$.id"
todoListName2: jsonpath "$.name"

# update multiple todo-lists
PATCH http://{{host}}/users/{{userId}}/todo-lists
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
[Options]
variable: newName1 = "new-name-{{newUuid}}"
variable: newName2 = "new-name-{{newUuid}}"
[
  {
    "id": "{{todoListId}}",
    "payload": {
      "name": "{{newName1}}",
      "order": 9392
   }
 },
  {
    "id": "{{todoListId2}}",
    "payload": {
      "name": "{{newName2}}"
    }
  }
]
HTTP 200
[Asserts]
jsonpath "$[0].name" == "{{newName1}}"
jsonpath "$[0].order" == 9392
jsonpath "$[1].name" == "{{newName2}}"

# payload not provided
PATCH http://{{host}}/users/{{userId}}/todo-lists
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
[
  {
    "id": "{{todoListId}}"
  }
]
HTTP 400 # bad-request

# id not provided
PATCH http://{{host}}/users/{{userId}}/todo-lists
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
[
  {
    "payload": {
      "name": "new-2-{{newUuid}}"
    }
  }
]
HTTP 400 # bad-request

# extra data in payload (`forbidNonWhitelisted` should filter this)
PATCH http://{{host}}/users/{{userId}}/todo-lists
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
[
  {
    "id": "{{todoListId2}}",
    "payload": {
      "name": "new-2-{{newUuid}}",
      "foo": "bar"
    }
  }
]
HTTP 400


# invalid payload
PATCH http://{{host}}/users/{{userId}}/todo-lists
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
[
  {
    "id": "{{todoListId}}",
    "payload": {
      "name": "new-{{newUuid}}",
      "order": "foo"
   }
 },
  {
    "id": "{{todoListId2}}",
    "payload": {
      "name": "new-2-{{newUuid}}"
    }
  }
]
HTTP 400

# empty  payload
PATCH http://{{host}}/users/{{userId}}/todo-lists
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
[
  {
    "id": "{{todoListId}}",
    "payload": {}
  }
]
HTTP 200

# one of todo-list does not exist
PATCH http://{{host}}/users/{{userId}}/todo-lists
Authorization: {{tokenType}} {{accessToken}}
content-type: application/json
[
  {
    "id": "{{newUuid}}",
    "payload": {}
  },
  {
    "id": "{{todoListId2}}",
    "payload": {
      "name": "new-2-{{newUuid}}"
    }
  }
]
HTTP 404 # not-found

####################
# Testing deletion #
####################

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
