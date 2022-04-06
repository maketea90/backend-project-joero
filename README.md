# Northcoders News API

This project is a fully tested backend api, with several endpoints. The link below will take you to a webpage with a description of all the different endpoints available.

Here is a link to the hosted version of the backend api which I have built: https://backend-project-joero.herokuapp.com/api

In order to clone this repo down to your local machine please run the following command in the folder you wish to clone it down into:

git clone https://github.com/maketea90/backend-project-joero.git

Anyone cloning this repo will need to add .env.test and .env.development files in the root directory containing PGDATABASE=database_name_here replacing database_name_here with the test database name in the .env.test file and development database name in the .env.development file respectively.

Initially, all dependencies should be installed via the command:

npm install

Then, to create and seed the databases, the following two commands must be run in this order:

npm setup-dbs

npm seed

Testing can be run via the command:

npm test

The minimum node js version required is 16.8.0, and the minimum postgres version required is 13.4