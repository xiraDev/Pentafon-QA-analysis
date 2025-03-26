# Xira Backend Core

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/xiraDev/template-voicebot-business/blob/main/LICENSE)

# Get Started

This project was created with the `Xira Core Backend v1.0.0` base system

# Getting started

## Installation

Install all the dependencies using npm
```sh
npm install
```

## Config

Copy the example env file and make the required configuration changes in the .env file

```sh
cp .env.example .env
```

### Database migrations

Run the database migrations **(Set the database connection in .env before migrating)**

In this project there is a command to create the first tables in the database and check the successful connection, (optional) run:

```sh
npm run migrate:up
```

Or 

Use the command like so: 
```sh
npm run migrate:up -- --url <url>
```

For example
```sh
npm run migrate:up -- --url 'mysql://root:password@mysql_host.com/database_name'
```

If everything is ok, the above command will create the **users** and **roles** tables, this tables is used for all users that will have access to the system.

**Make sure you set the correct database connection information before running the migrations**

### Database seeding

**Populate the database with seed data with relationships which includes users and roles. This can help you to quickly start testing the api or couple a frontend and start using it with ready content.**

For fill tables with dummy values, (optional) run the database seeder and you're done:

```sh
npm run seed:all
```

## Encrypt

To enable E2EE encryption just set the environment variable `ENABLE_CRYPTO_CHANNEL` to true.

By default the variable is empty which will disable this option.

# Commitlint

Get high commit message quality and short feedback cycles by linting commit messages right when they are authored.

 See more about [commintlint](https://commitlint.js.org/#/guides-local-setup?id=guide-local-setup)

## Husky: Activate hooks

A handy git hook helper available on npm.

```sh
npx husky install
or
yarn husky install
```