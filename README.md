# Proofpoint Mock API

## Components
* custom api: mocks Proofpoint's `send` api endpoint and sends an email with smtp
* Nodemailer: smtp client
* Mailhog: fake smtp server

## Build the proofpoint mock api
```
pnpm clean && pnpm install && pnpm build
docker compose build --no-cache
```

## Usage (local development)
Starts the fake smtp server and the mock api:
```
pnpm dev
```

Send a PUT request to the /send api endpoint
e.g.
```
curl --location 'http://localhost:3000/send' \
--header 'Content-Type: application/json' \
--data-raw '{
  "content": [
    {
      "body": "Simple test message from SER!",
      "type": "text/html"
    }
  ],
  "from": {
    "email": "USER@YOURDOMAIN.COM"
  },
  "headers": {
    "from": {
      "email": "USER@YOURDOMAIN.COM"
    }
  },
  "subject": "Test Subject from SER!",
  "tos": [
    {
      "email": "RECIPIENT@YOURDOMAIN.COM",
      "name": "YOUR NAME"
    }
  ]
}'
```