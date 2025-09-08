# Proofpoint Mock API

## Rationale
We have an application that previously sent emails using SendGrid. 
For local development and testing, we relied on Docker images that mock SendGrid (e.g. ghashange/sendgrid-mock) to capture and inspect emails without sending them externally.

A new requirement mandated migration from SendGrid to Proofpoint Secure Email Relay. 
At the time of writing, no equivalent mocking solution exists for Proofpoint that provides the same local email sending & receiving functionality as sendgrid-mock. 
This gap created the need for the code in this repository.

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

## Usage (docker compose)
1. Add the following to `docker-compose`:
   1. Select a smtp service (e.g. mailhog) and configure it
   2. Configure the proofpoint-mock service
    ```
        smtp:
          image: mailhog/mailhog:v1.0.1
          container_name: smtp_server_dev
          restart: unless-stopped
          ports:
            - "1025:1025"   # SMTP
            - "8025:8025"   # Web UI
    
        proofpoint:
          container_name: proofpoint_dev
          image: ghcr.io/eresearchqut/proofpoint-mock:publish_docker
          environment:
            - PORT=3000
            - SMTP_HOST=smtp
            - SMTP_PORT=1025
          depends_on:
            - smtp
          ports:
            - "7002:3000"
    ```
2. Check emails: http://localhost:8025