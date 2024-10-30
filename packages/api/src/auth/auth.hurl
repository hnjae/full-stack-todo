POST http://localhost:3000/auth/register
content-type: application/json
{
  "email": "example{{random_int_number}}@example{{random_int_number}}.com",
  "password": "example"
}

POST http://localhost:3000/auth/register
content-type: application/json
{
  "email": "example@example.com",
  "password": "example"
}
