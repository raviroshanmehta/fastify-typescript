[![N|Solid](https://www.fastify.io/images/fastify-logo-menu.d13f8da7a965c800.png)](https://www.fastify.io)


### Fastify App Boiler Plate with TypeScript , API versioning and Swagger Documentation

This app is generated via fastify-cli generator.

## Features Working

- Typescript 
- REST APIs versoning enabled. like - /api/v1 , api/v2
- Admin Panel routing enabled with ejs template - /admin
- Swagger enabled for APIs docs.

## To Do
- Admin Panel CURD Manager
- Deployment Setup via PM2, Docker, Kubernetes
- Unit Testing 

### Prerequisite 
- ###### Redis connection
- ###### MongoDB connection
- ###### NodeJS v14+ version (App was tested on Node v14.16.1 during development, You may try another versions.)

## Installation

Clone repo , install the dependencies and devDependencies and start the server.

```sh
git clone https://github.com/raviroshanmehta/fastify-typescript
cd fastify-typescript
npm i
cp .env.example .env
npm run dev
```

For production environments...

```sh
git clone https://github.com/raviroshanmehta/fastify-typescript
cd fastify-typescript
npm i
cp .env.example .env
npm start
```

If your app didn't started, You need to check error. Or create an issue if still you are stuck.  

| Link | Link |
| ------ | ------ |
| Home Page | http://127.0.0.1:5000 |
| Admin | http://127.0.0.1:5000/admin |
| API V1 | http://127.0.0.1:5000/api/v1 |
| API V2 | http://127.0.0.1:5000/api/v2 |
| APIs Root | http://127.0.0.1:5000/api |


## License

MIT

**Free Software, Hell Yeah!**
