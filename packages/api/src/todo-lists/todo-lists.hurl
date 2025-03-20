GET http://{{host}}/users
[Options]
variable: host = "localhost:3000"
HTTP 200
[Captures]
userId: jsonpath "$[0].id"

GET http://{{host}}/users/{{userId}}/todo-lists
HTTP 200

POST http://{{host}}/users/{{userId}}/todo-lists
content-type: application/json
{
  "name": "{{newUuid}}",
  "order": {{random_int_number}}
}
HTTP 201
[Captures]
todoListId: jsonpath "$['id']"

POST http://{{host}}/users/{{userId}}/todo-lists
content-type: application/json
{
  "name": "{{newUuid}}"
}
HTTP 400

GET http://{{host}}/users/{{userId}}/todo-lists/{{todoListId}}
HTTP 200

GET http://{{host}}/users/{{userId}}/todo-lists/{{newUuid}}
HTTP 404

PUT http://{{host}}/users/{{userId}}/todo-lists/{{todoListId}}
content-type: application/json
{
  "name": "{{newUuid}}"
}
HTTP 200

PUT http://{{host}}/users/{{userId}}/todo-lists/{{newUuid}}
content-type: application/json
{
  "name": "{{newUuid}}"
}
HTTP 404

DELETE http://{{host}}/users/{{userId}}/todo-lists/{{todoListId}}
HTTP 200

DELETE http://{{host}}/users/{{userId}}/todo-lists/{{todoListId}}
HTTP 404
