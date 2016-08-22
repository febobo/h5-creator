var ComponentModel = require('../model/components');

exports.add = function * (){
	var ctx = this;
	var body = ctx.request.body;
	if(!body.name || !body.category || !body.content){
		return this.body = {
			code : 0,
			msg : '缺少必要信息'
		}
	}
	const result = yield ComponentModel.findOne({'name':body.name})
	if(result){
		return this.body = {
			code : 0,
			msg : '名称已存在'
		}
	}

	var component = new ComponentModel(body);
	var newObj = yield component.save();
	return this.body = {
		code : 1,
		msg : '添加成功'
	}
}

exports.get = function * (){
	var ctx = this;
	var body = ctx.request.body;
	const result = yield ComponentModel.find({});
	return this.body = {
		code : 1,
		data : {
			list : result ? result : [],
			count : result ? result.length : 0
		},
		msg : 'ok'
	}
}
