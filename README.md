# Cinema API

NestJS service for a cinema: films, halls, showings and seat bookings.
Data is kept in memory and is lost on restart.

## Install

```bash
npm install
```

## Run (development)

```bash
npm run start:dev
```

The server listens on `http://localhost:3000`, Swagger UI is at `/docs`.

## Environment

Copy `.env.example` to `.env` (the file is git-ignored):

```env
PORT=3000
```

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `PORT`   | `3000`  | HTTP port   |

## Manual check

Open `requests.http` (VS Code "REST Client" extension) and run the requests
top to bottom. Ids are taken from earlier responses via variables.

## Tests

```bash
npm test
npm run test:e2e
```
