#!/bin/sh

curl --location --request POST 'http://localhost:8000/post' \
--header 'Content-Type: application/json' \
--data-raw '{
	"message": "Hello, World!"
}'
