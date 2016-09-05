var mongoose = require('mongoose');
var FileSchema = require('../schemas/file');
module.exports = mongoose.model('File',FileSchema);
