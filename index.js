/** Require external modules */
const express = require(`express`);
const ezobjects = require(`ezobjects-mysql`);
const fs = require(`fs`);
const moment = require(`moment-timezone`);
const mysql = require(`mysql-await`);
const numeral = require(`numeral`);
const parser = require(`body-parser`);
const strapped = require(`strapped`);

/** Require local modules */
const constants = require(`./constants`);
const models = require(`./models`);
const views = require(`./views`);

/** Self-executing asynchronous wrapper function so we can 'await' asynchronous things */
(async () => {
  /** Create MySQL database connection pool using configured credentials */
  const pool = mysql.createPool(JSON.parse(fs.readFileSync(`mysql-config.json`)));

  /** Use provided events to log database activity */
  pool.on(`acquire`, (connection) => {
    console.log(`MySQL: Connection %d acquired`, connection.threadId);
  }).on(`connection`, (connection) => {
    console.log(`MySQL: Connection %d connected`, connection.threadId);
  }).on(`enqueue`, () => {
    console.log(`MySQL: Waiting for available connection slot`);
  }).on(`release`, (connection) => {
    console.log(`MySQL: Connection %d released`, connection.threadId);
  });

  /** Provide the ability to cleanly interrupt the server using Cntl-C and close the database properly */
  process.on(`SIGINT`, async () => {
    await pool.awaitEnd();

    process.exit(0);
  });

  /** Grab a new MySQL connection from the pool */
  const db = await pool.awaitGetConnection();

  /** Create the tables for your EZ objects that are stored in the database */
  await ezobjects.createTable(models.configUser, db);

  /** Release database connection */
  db.release();

  /** Create new express web server */
  const app = express();

  /** Use body parser module to parse POST requests off the header */
  app.use(parser.urlencoded({ extended: true }));

  /** Log each request */
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} requested by ${req.ip}`);

    /** Call the next express route */
    next();
  });

  /** Server up CSS files when needed */
  app.all(`/css/:file`, (req, res) => {
    res.sendFile(__dirname + `/css/` + req.params.file, (err) => { if ( err && !res.headerSent ) res.sendStatus(404).end(); });
  });

  /** Server up image files when needed */
  app.all(`/images/:file`, (req, res) => {
    res.sendFile(__dirname + `/images/` + req.params.file, (err) => { if ( err && !res.headerSent ) res.sendStatus(404).end(); });
  });

  /** Server up client-side JavaScript files when needed */
  app.all(`/js/:file`, (req, res) => {
    res.sendFile(__dirname + `/js/` + req.params.file, (err) => { if ( err && !res.headerSent ) res.sendStatus(404).end(); });
  });

  /** Attach various other objects to the request object prior to processing */
  app.use(async (req, res, next) => {
    console.log(`Aquiring database connection and attaching items to request...`);

    /** Try to grab a new MySQL connection from the pool */
    try {
      req.db = await pool.awaitGetConnection();
    } catch ( err ) {
      return res.status(503).send(`Database unavailable, please try again later...`);
    }

    /**
     * Let's modify the normal res.redirect method so it automatically releases the acquired database connection prior to redirecting.
     * We can start by storing the original redirect method in a local variable.
     */
    const origRedirect = res.redirect;

    /** Overwrite the original res.redirect method with our new version */
    res.redirect = function () {
      console.log(`Redirecting to ${arguments[0]} and releasing database connection...`);

      /** Release the database connection for this request */
      req.db.release();

      /** Call the original redirect method */
      return origRedirect.call(res, ...arguments);
    };

    /** Let's consolidate our form data onto one object, req.data, instead of req.query and req.body separately */
    req.data = req.method == `GET` ? req.query : { ...req.query, ...req.body };

    /** Let's attach several useful objects to the request */
    req.constants = constants;
    req.models = models;
    req.moment = moment;
    req.numeral = numeral;
    req.StrappedError = strapped.StrappedError;

    /** Create a new strapped page for creating user interfaces */
    req.page = new strapped.Page();

    /** Call the next express route */
    next();
  });

  /** Output header */
  app.use(views.header);

  /** List your view routes in sequential order */
  app.all(`/load/user`, views.loadUser);

  /** The last route involves sending the page and closing the database */
  app.use((req, res) => {
    console.log(`Rendering requested view and releasing database connection,...`);

    /** Render the strapped page and send to requestor */
    res.send(req.page.render());

    /** Release the database connection for this request */
    req.db.release();
  });

  /** Start the web server! */
  app.listen(3000, () => {
    console.log(`Server started on port 3000.`);
  });
})();
