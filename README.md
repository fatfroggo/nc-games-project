# Northcoders House of Games API

This repo contains the set up for a games API, created as part of a back-end project. The project allows users to search a database for game reviews, information regarding users and comments, and to add, delete and update comments and reviews.

The link to the hosted version of this API is: 

https://fatfroggo-games-database.cyclic.app

To see a list of all available endpoints, add '/api/ to this url.
 
## Initial setup 
 
In order to clone this repository, use the 

```git clone https://github.com/fatfroggo/nc-games-project.git1```

command in your teminal, to clone the repo into a folder of your choice on your local device. Following this, ensure the repository has been initialised by running 

```npm itit -y```

## Installing dependencies 

Please ensure supertest and express modules are installed in order to utilise the repo.

``` npm install supertest```
``` npm install express```

## Seeding the local databases

 A script has been added to the package.json in order to seed the databases. To run this, run

 ```npm run seed``` 

 in the terminal.
 
## Connecting to DB's locally
 
In order to connect to the relevant databases locally, add a .env.test and a .env.development file, which correspond to the appropriate databases (database names can be found in the setup.sql file). To see an example format for these files, please see the .env.example file.

## Running tests

Ensure jest is installed in your repository. Please run

```npm install jest -D```

Following this. Tests can be run by running the 
```npm test``` command in termanal. 

## Minimum system requirements

In order to sucessfully interact with this project, please ensure you have minimum verions of Node.js (v18.9.0) and postgres (v8.7.3).