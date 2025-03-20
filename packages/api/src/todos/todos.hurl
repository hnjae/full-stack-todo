GET http://{{host}}/users
[Options]
variable: host = "localhost:3000"
HTTP 200
[Captures]
userId: jsonpath "$[0].id"

POST http://{{host}}/users/{{userId}}/todo-lists
content-type: application/json
{
  "name": "{{newUuid}}",
  "order": {{random_int_number}}
}
HTTP 201

GET http://{{host}}/users/{{userId}}/todo-lists
HTTP 200
[Captures]
todoListId: jsonpath "$[0].id"

GET http://{{host}}/users/{{userId}}/todos
HTTP 200

POST http://{{host}}/users/{{userId}}/todos
content-type: application/json
{
  "title": "Buy milk",
  "completed": false,
  "order": {{random_int_number}},
  "todoListId": "{{todoListId}}"
}
HTTP 201
[Captures]
todoId: jsonpath "$['id']"

# Missing attribute
POST http://{{host}}/users/{{userId}}/todos
content-type: application/json
{
  "completed": false,
  "order": {{random_int_number}},
  "todoListId": "{{todoListId}}"
}
HTTP 400 # BAD_REQUEST

# use invalid todoListId
POST http://{{host}}/users/{{userId}}/todos
content-type: application/json
{
  "title": "Buy milk",
  "completed": false,
  "order": {{random_int_number}},
  "todoListId": "{{newUuid}}"
}
HTTP 400 # BAD_REQUEST

GET http://{{host}}/users/{{userId}}/todos/{{todoId}}
HTTP 200

GET http://{{host}}/users/{{userId}}/todos/{{newUuid}}
HTTP 404 # NOT_FOUND

PUT http://{{host}}/users/{{userId}}/todos/{{todoId}}
content-type: application/json
{
  "completed": false,
  "order": {{random_int_number}}
}
HTTP 200

# use invalid todoListId
PUT http://{{host}}/users/{{userId}}/todos/{{todoId}}
content-type: application/json
{
  "completed": false,
  "order": {{random_int_number}},
  "todoListId": "{{newUuid}}"
}
HTTP 400 # BAD_REQUEST

# no-existing todo
PUT http://{{host}}/users/{{userId}}/todos/{{newUuid}}
content-type: application/json
{
  "completed": false,
  "order": {{random_int_number}},
  "todoListId": "{{newUuid}}"
}
HTTP 404 # NOT_FOUND

DELETE http://{{host}}/users/{{userId}}/todos/{{todoId}}
HTTP 200

DELETE http://{{host}}/users/{{userId}}/todos/{{todoId}}
HTTP 404 # NOT_FOUND
