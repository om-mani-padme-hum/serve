# Serve v1.0.0

A generic web service framework with a few helpful addons, including:

* ExpressJS Web Server
* Strapped (Bootstrap 4)
* MySQL Await
* EZ Objects - MySQL
* Moment.js (w/ Timezone support)
* Numeral.js
* jQuery

Be advised you need a MySQL database to connect to, and need to configure it.

## Installation:

1. Clone this repository
2. Using your terminal application, navigate to the folder run the following to install required modules:

```bash
npm i
```

3. Install two global dependencies

```bash
npm i -g browserify
npm i -g eslint
```

4. Install MySQL and configure it with a username, password, and database
5. Configure the application by putting your MySQL information in mysql-config.json, like shown below:

```json
{
  "connectionLimit" : 10,
  "host"            : "example.org",
  "user"            : "bob",
  "password"        : "secret",
  "database"        : "my_db"
}
```
