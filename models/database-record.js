/** Require external modules */
const ezobjects = require(`ezobjects-mysql`);

const configDatabaseRecord = {
  className: `DatabaseRecord`,
  properties: [
    { name: `id`, type: `int` }
  ]
};

const DatabaseRecord = ezobjects.createClass(configDatabaseRecord);

module.exports.configDatabaseRecord = configDatabaseRecord;
module.exports.DatabaseRecord = DatabaseRecord;
