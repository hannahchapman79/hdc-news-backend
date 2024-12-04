# Backend HDC News

Hosted version: https://be-nc-news-flqs.onrender.com

## Description

This project is the backend for a news application, including both the API and database. The API is designed to access application data programmatically, mimicking the construction of a real-world backend service (similar to Reddit) that supports front-end architecture. 

## Getting Started

### Dependencies

**Development Dependencies**
Husky: ^8.0.2
Jest: ^27.5.1
Jest-Sorted: ^1.0.14
Supertest: ^6.3.4

**Dependencies**
PG-Format: ^1.0.4
Dotenv: ^16.3.1
Express: ^4.18.2
PG: ^8.7.3

**Requirements**
Postgres: v14.10
Node.js: v21.1.0

### Installation

1. Clone the repository
2. Run "npm install"

### Environment Variables
3. Create Environment Files: Create two .env files: .env.test and .env.development. Each file should contain the appropriate database name for that environment.

### Setting Up the Database
4. Install dependencies outlined above
5. Run the commands "npm run setup-dbs" and "npm run seed"

### Running Test Suite
6. Run "npm run test"

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
