var newNS        = require("./lib/ns"),
    newExtension = require('./lib/extension'),
    newFragment   = require("./lib/fragment");

module.exports     = newFragment;
module.exports.ns  = newNS;
module.exports.ext = newExtension;
