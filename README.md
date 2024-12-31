# YouApp Assessment Challenge (Back-end Developer)

This project was created to complete one of the stages of the recruitment process as a Backend Developer at YouApp.

## Prerequisites

- Node.js (recommended: v20.17.0) - [Download](https://nodejs.org/en)
- Docker (latest) - [Download](https://docs.docker.com/get-started/get-docker/)
- Git (latest) - [Download](https://git-scm.com/downloads)

## Project setup

### 1. Clone the Repository

```bash
$ git clone https://github.com/agungrhiz/assessment-youapp.git
$ cd assessment-youapp
```

### 2. Copy Environment File

```bash
$ cp .env.example .env
```

Edit the .env file and replace placeholders with your actual configurations.

### 3. Build and Run with Docker Compose

```bash
$ docker-compose up --build
```

### 4. Access the Application

- The API will be accessible at: `http://localhost:3000/api-docs`
- RabbitMQ: `http://localhost:15672`
- MongoDB: `localhost:27017`

## API Endpoints

### Authentication

- POST: `/api/register`
- POST: `/api/login`

### Users

- POST: `/api/createProfile`
- GET: `/api/getProfile`
- PUT: `/api/updateProfile`
- POST: `/api/uploadProfilePicture`
- GET: `/api/profilePicture`

### Chats

- POST: `/api/sendMessage`
- GET: `/api/viewMessages`
