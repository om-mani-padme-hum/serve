# Serve

A generic web service framework with a few helpful addons, including:

* ExpressJS Web Server
* Strapped (Bootstrap 4)
* MySQL Await
* EZ Objects - MySQL
* Moment.js (w/ Timezone support)
* Numeral.js
* jQuery

Be advised you need a MySQL database to connect to, and need to configure it.

## MySQL Configuration:

### Example JSON configuration

```json
{
  "connectionLimit" : 10,
  "host"            : "example.org",
  "user"            : "bob",
  "password"        : "secret",
  "database"        : "my_db"
}
```
