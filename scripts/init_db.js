/**
 * Init DB script
 */

var Dao = require("./lib/dao/GenericDao")();

var dao = new Dao();

dao.recreateTables();

dao.dumpTables();

dao.finalize();