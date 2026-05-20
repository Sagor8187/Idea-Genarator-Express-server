# NextIdea Server 

Backend server for the NextIdea startup idea sharing platform.
This server handles authentication, JWT verification, idea management, comment system, and MongoDB database operations.

---

## Live API

[https://your-server-site.vercel.app](https://idea-genarator-express-server.vercel.app/)

---

## Features

* REST API with Express.js
* MongoDB Database Integration
* JWT Authentication Middleware
* Protected Private Routes
* CRUD Operations for Ideas
* CRUD Operations for Comments
* User-specific Ideas API
* User-specific Comments API
* Search Ideas using MongoDB Regex
* Filter Ideas by Category
* Trending Ideas API
* Secure Token Verification using JWKS
* CORS Enabled
* Environment Variable Support

---

## Tech Stack

* Node.js
* Express.js
* MongoDB
* jose-cjs
* dotenv
* cors

---

## API Endpoints

### Idea APIs

| Method | Endpoint       | Description        |
| ------ | -------------- | ------------------ |
| GET    | `/idea`        | Get all ideas      |
| GET    | `/idea/:id`    | Get single idea    |
| POST   | `/idea`        | Add new idea       |
| PATCH  | `/idea/:id`    | Update idea        |
| DELETE | `/idea/:id`    | Delete idea        |
| GET    | `/my-idea/:id` | Get user ideas     |
| GET    | `/home-idea`   | Get latest 6 ideas |

---

### Comment APIs

| Method | Endpoint          | Description          |
| ------ | ----------------- | -------------------- |
| POST   | `/comment`        | Add comment          |
| GET    | `/comment/:id`    | Get comments by post |
| PATCH  | `/comment/:id`    | Update comment       |
| DELETE | `/comment/:id`    | Delete comment       |
| GET    | `/my-comment/:id` | Get user comments    |

---

## Authentication

This server uses JWT authentication with JWKS verification.

### Protected Routes

* Add Idea
* Update Idea
* Delete Idea
* My Ideas
* Add Comment
* Update Comment
* Delete Comment
* My Comments

---

## Environment Variables

Create a `.env` file in the root directory and add:

```env
MONGO_URI=your_mongodb_uri
PORT=5000
CLIENT_URL=your_client_url
```

---

## Installation

### Clone Repository

```bash
git clone your-server-repository-link
```

### Install Dependencies

```bash
npm install
```

### Start Server

```bash
node index.js
```

---

## Dependencies

```json
"cors": "^2.8.6",
"dotenv": "^17.4.2",
"express": "^5.2.1",
"jose-cjs": "^6.2.3",
"mongodb": "^7.2.0"
```


