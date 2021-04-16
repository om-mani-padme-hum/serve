/** Require external modules */
const ezobjects = require(`ezobjects-mysql`);

/** Require local modules */
const databaseRecord = require(`./database-record`);

/** Configure the EZ object */
const configUser = {
  className: `User`,
  tableName: `users`,
  extends: databaseRecord.DatabaseRecord,
  extendsConfig: databaseRecord.configDatabaseRecord,
  properties: [
    { name: `age`, type: `tinyint` },
    { name: `balance`, type: `double` },
    { name: `firstName`, type: `varchar`, length: 16 },
    { name: `lastName`, type: `varchar`, length: 16 },
    { name: `sex`, type: `tinyint` }
  ]
};

/** Create the EZ object */
const User = ezobjects.createClass(configUser);

/** Add a method to the class prototype */
User.prototype.fullName = function () {
  return this.firstName() + ` ` + this.lastName();
};

/** Export the configuration and class */
module.exports.configUser = configUser;
module.exports.User = User;
