const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
	url : String,
	webp_url : String,
	name : String,
	size : String,
	create_time : Date
})

fileSchema.statics = {
	findById: function(id, cb) {
		return this.findOne({ _id : id }, cb);
	}
};

module.exports = fileSchema
