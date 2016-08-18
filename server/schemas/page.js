const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
	content : {
		type : String
	},
	name : {
		type : String
	},
	create_time : Date
})

pageSchema.statics = {
	findById: function(id, cb) {
		console.log(id)
		return this.findOne({ _id : id }, cb);
	}
};

module.exports = pageSchema
