var mongoose = require('mongoose');
var ComponentSchema = require('../schemas/components');
module.exports = mongoose.model('Components',ComponentSchema);
