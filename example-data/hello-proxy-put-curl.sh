#!/bin/sh

curl --location --request PUT 'http://localhost:8000/put' \
--header 'Content-Type: application/json' \
--data-raw '{
	"message": "Hello, World!"
}'
