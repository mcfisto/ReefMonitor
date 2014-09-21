/**
 * Init DB script
 */
global.__base = __dirname+'/../';

var Dao = require(__base+"lib/dao/GenericDao")();

var dao = new Dao();

dao.recreateTables();

dao.dumpTables();

dao.finalize();