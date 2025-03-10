POST http://localhost:3000/auth/register
content-type: application/json
{
  "email": "example{{random_int_number}}@example{{random_int_number}}.com",
  "password": "example"
}
HTTP 201

POST http://localhost:3000/auth/register
content-type: application/json
{
  "email": "example@example.com",
  "password": "example"
}

# password-empty
POST http://localhost:3000/auth/register
content-type: application/json
{
  "email": "example{{random_int_number}}@example{{random_int_number}}.com"
}
HTTP 400

# email-empty
POST http://localhost:3000/auth/register
content-type: application/json
{
  "password": "example"
}
HTTP 400

POST http://localhost:3000/auth/login
content-type: application/json
{
  "email": "not-exist-example{{random_int_number}}@example{{random_int_number}}.com",
  "password": "example"
}
HTTP 401

POST http://localhost:3000/auth/login
content-type: application/json
{
  "email": "example@example.com",
  "password": "example"
}
HTTP 200

POST http://localhost:3000/auth/login
content-type: application/json
{
  "email": "example@example.org",
  "password": "example"
}
HTTP 200

POST http://localhost:3000/auth/token
content-Type: application/x-www-form-urlencoded
[FormParams]
grant_type: password
username: example@example.org
password: example

POST http://localhost:3000/auth/token
content-type: application/json
{
  "grant_type": "password",
  "username": "example@example.org",
  "password": "example"
}

POST http://localhost:3000/auth/token
content-Type: application/x-www-form-urlencoded
[FormParams]
grant_type: refresh_token
refresh_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5YmY5NTkyZi1jZDM1LTQyNWMtOTNjZC00NDVhMDMzYzEyNDYiLCJqdGkiOiI1ZTRkZGRlNy0wYzhmLTQ4MDItOGU1ZS01YTg2MWMzMjU1MDciLCJleHAiOjE3NDIyMTg2MTEsImlhdCI6MTc0MTYxMzgxMX0.8zqlr-LdxizX7fUDKJlhNPbVdeo7mID_hLgg8cXxDyE
