var mongoose = require('mongoose');
var PageSchema = require('../schemas/page');
module.exports = mongoose.model('Page',PageSchema);
