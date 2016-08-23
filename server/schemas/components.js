const mongoose = require('mongoose');

const ComponentSchema = new mongoose.Schema({
	content : {
		type : String
	},
	name : {
		type : String
	},
	category : {
		type : String
	},
	create_time : Date
})

ComponentSchema.statics = {
	findByName: function(name, cb) {
		return this.findOne({ name: name }, cb);
	}
};

module.exports = ComponentSchema
