# Sample-task

SampleTask is a simple REST API.

It’s built with JavaScript – a very light [node](https://nodejs.org) plus [express](http://expressjs.com) server, [mongo](https://www.mongodb.com/) database.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Documentation](#documentation)

## Installation

You can either run it manually or using Docker commands to spawns up all the stack components.

#### Manually

1. Go to `sample-task`
2. Set `db.uri` in the `./lib/config.js` file to your mongodb uri
3. Run the following commands:
    1. `npm install`
    2. `npm test`
    3. `npm start`

You can now access to API-Endpoints through [http://localhost:3000/api/](http://localhost:3000/api/). See [API-Endpoints Documentation](#documentation).

#### Docker

Run the following commands: `docker-compose up -d`

You can now access to API-Endpoints through [http://localhost:3000/api/](http://localhost:3000/api/). See [API-Endpoints Documentation](#documentation).

## Features

- [x] Login/Register
- [x] Create notes
- [x] List their own notes

## Documentation

The documentation for the API-Endpoints is located at [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)

> Please make sure the server is setup and running before accessing to the documentation 
