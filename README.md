# Full-Stack Todo List

This repository contains a React Native (Expo + TypeScript) frontend and a Node.js + Express + PostgreSQL backend for managing todos.

## Requirements

- Node.js
- npm 
- PostgreSQL

## Frontend (React Native)

1. Make sure the backend is running first (see Backend section below).

2. Install dependencies and start:

```
cd frontend
npm install
npm run start
```

- Select the on-screen options (on console) to open the Expo app on your preferred platform (iOS simulator, Android emulator, or web).
- The frontend will automatically connect to the backend API at `http://localhost:3000` (for web) or `http://localhost:3000` (for iOS simulator).
- **For Android emulator**: Update `frontend/src/config/api.ts` to use `http://10.0.2.2:3000` instead of `localhost`.
- **For physical device**: Update `frontend/src/config/api.ts` to use your machine's IP address (e.g., `http://192.168.1.100:3000`).

3. Run tests:

```
npm test
```

## Backend (Express + PostgreSQL)

1. Copy the sample env file and update it with your credentials:

```
cd backend
cp .env.example .env
```

Edit `.env` and set your `DATABASE_URL` (e.g., `postgresql://user:password@localhost:5432/todos`).

2. Install dependencies:

```
npm install
```

3. Run database migrations:

```
npm run migrate
```

This will create the `todos` table automatically. Migrations run automatically on server startup, but you can also run them manually.

4. Start the server:

```
npm run dev
```

The API will be available at `http://localhost:3000` (configurable via `PORT`).

**Note:** The server will test the database connection and run migrations before starting. If the connection fails, the server will not start and display an error message.

### Health Check Endpoint

- `GET /health` — Check server and database status
  - Returns `200` if database is connected
  - Returns `503` if database is disconnected
  - Response includes connection status and timestamp

### API Endpoints

- `GET /todos` — list all todos
- `POST /todos` — create a todo (body: `{ "text": "..." }`)
- `PUT /todos/:id` — update completion status (body: `{ "completed": true }`)
- `DELETE /todos/:id` — delete a todo

### Backend Tests

```
cd backend
npm test
```

The tests mock the database layer and run quickly without a live PostgreSQL instance.

