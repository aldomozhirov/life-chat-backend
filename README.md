# Life Chat Backend

Backend application for Life Chat - platform helping psychologists to work with their patients throw chat messengers.

## Technologies
- Node
- Koa
- Joi
- MongoDB
- Telegram Bot API

## How to run app
1. Set environment variables or use `.env` file. Example:
    ```
    DB_URI=mongodb://127.0.0.1:27017/lifechatdb
    JWT_SECRET=84573695730af7da3ab1bb716f745df7
    NODE_ENV=production
    PORT=8000
    API_VERSION=1
   ```
2. Install npm dependencies:
    ```shell
    npm install
    ```
2. Run the app:
    ```shell
    npm start
    ```

## Related repositories
[life-chat-ui](https://github.com/aldomozhirov/life-chat-ui)

## Available Endpoints

### Users

#### POST /users
Creates a new user
##### Payload
```json lines
{
  "first_name": string,
  "last_name": string,
  "patronymic": string,
  "inn": string,
  "phone": string,
  "email": string,
  "nationality": string
}
```
##### Response
```json lines
{
  "id": string,
  "created_at": string,
  "first_name": string,
  "last_name": string,
  "patronymic": string,
  "inn": string,
  "phone": string,
  "email": string,
  "nationality": string,
  "experience": string,
  "rate": string,
  "welcome_message": string
}
```

#### POST /users/authorise
Authenticates a user based on credentials
##### Payload
```shell
{
  "username": string
  "password": string
}
```
##### Response
```json lines
{
  "auth_token": string // JWT token
}
```

#### PUT /users/bot
Updates user's Telegram bot configuration parameters
##### Payload
```json lines
{
  "token": string // User's Telegram bot token
}
```
##### Response
```json
{
  "result": "SUCCESS"
}
```

#### PUT /users/details
Updates user details
##### Payload
```json lines
{
  "rate": number, // Hourly pay rate in local currency
  "experience": number, // Years of experience
  "welcome_message": string // First consultation message content to be sent to patients
}
```
##### Response
```json
{
  "result": "SUCCESS"
}
```

#### PUT /users/payment
Updates user payment parameters
##### Payload
```json lines
{
  "card_number": string // User's bank card number, to which payments will be sent from patients
}
```
##### Response
```json
{
  "result": "SUCCESS"
}
```

#### GET /users/me
Fetches authenticated user parameters
##### Response
```json lines
{
  "id": string,
  "created_at": string,
  "first_name": string,
  "last_name": string,
  "patronymic": string,
  "inn": string,
  "phone": string,
  "email": string,
  "nationality": string,
  "experience": string,
  "rate": string,
  "welcome_message": string
}
```

#### GET /users/me/consultations
Fetches authenticated user's consultations
##### Response
```json lines
{
  "id": string,
  "created_at": string,
  "status": string,
  "duration": number,
  "total_cost": number,
  "can_send_message": boolean,
  "scheduled_on": string
}[]
```

### Consultations

#### GET /consultations/:consultationId
Fetches consultation by ID
##### Response
```json lines
{
  "id": string,
  "created_at": string,
  "status": string,
  "duration": number,
  "total_cost": number,
  "can_send_message": boolean,
  "scheduled_on": string
}
```

#### GET /consultations/:consultationId/messages
Fetch messages by consultation ID
##### Response
```json lines
{
  "id": string,
  "text": string,
  "sent_at": string,
  "patient": Patient
}[]
```

#### POST /consultations/:consultationId/reply
Sends message to the open consultation Telegram chat
##### Payload
```json lines
{
  "text": string
}
```
##### Response
```json lines
{
  "id": string,
  "text": string,
  "sent_at": string,
  "patient": Patient
}
```

#### PUT /consultations/:consultationId/start
Launches the consultation flow. Changes status of consultation from `NEW` to `PENDING`.
##### Response
```json lines
{
  "result": "SUCCESS",
  "status": "PENDING"
}
```

#### PUT /consultations/:consultationId/prepaid
Marks consultation as prepaid. Changes status of consultation from `PENDING` to `PREPAID`.
##### Response
```json lines
{
  "result": "SUCCESS",
  "status": "PREPAID"
}
```

#### PUT /consultations/:consultationId/complete
Completes the consultation. Changes consultation status to `WAIT_PAYMENT`.
##### Response
```json lines
{
  "result": "SUCCESS",
  "status": "WAIT_PAYMENT"
}
```
