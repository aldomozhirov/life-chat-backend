# Life Chat Backend

Backend application for Life Chat - platform helping psychologists to work with their patients throw chat messengers.

## Technologies
- Node
- Koa
- Joi
- MongoDB
- Telegram Bot API

## How to run app
1. Install npm dependencies:
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
  "auth_token": string
}
```

#### PUT /users/bot
Updates user's Telegram bot configuration parameters
##### Payload
```json lines
{
  "token": string
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
  "rate": number,
  "experience": number,
  "welcome_message": string
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
  "card_number": string
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
  TBD
}
```
##### Response
```json lines
{
  TBD
}
```

#### PUT /consultations/:consultationId/start
Launches the consultation flow. Changes status of consultation from `NEW` to `PENDING`.
##### Payload
```json lines
{
  TBD
}
```
##### Response
```json lines
{
  TBD
}
```

#### PUT /consultations/:consultationId/prepaid
Marks consultation as prepaid. Changes status of consultation from `PENDING` to `PREPAID`.
##### Payload
```json lines
{
  TBD
}
```
##### Response
```json lines
{
  TBD
}
```

#### PUT /consultations/:consultationId/complete
Completes the consultation. Changes consultation status to `WAIT_PAYMENT`.
##### Payload
```json lines
{
  TBD
}
```
##### Response
```json lines
{
  TBD
}
```
