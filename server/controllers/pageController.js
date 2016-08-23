var pageModel = require('../model/page');

exports.preview = function * (){
	var ctx = this;
	var body = ctx.request.body;
	if(!body.content){
		return this.body = {
			code : 0,
			msg : '内容不能为空'
		}
	}

	var pageContent;
	if(body.id){
		pageContent	= yield pageModel.findOne({"_id":body.id});
		pageContent.content = body.content;
		pageContent.save();
		return this.body = {
			code : 1,
			data : {
				content : pageContent.content,
				id : pageContent._id,
				link : 'http://192.168.1.10:3001/preview?id=' + pageContent._id,
				title : pageContent.title
			}
		}
	}

	var page = new pageModel(body);
	var newObj = yield page.save();
	return this.body = {
		code : 1,
		data : {
			content : newObj.content,
			id : newObj._id,
			link : 'http://192.168.1.10:3001/preview?id=' + newObj._id,
			title : newObj.title
		}
	}
}

exports.getPagelist = function * (){
	var ctx = this;
	var body = ctx.request.query;
	var pageContent;
	if(body.id){
		pageContent	= yield pageModel.findOne({"_id":body.id});
		return this.body = {
			code : 1,
			data : {
				content : pageContent.content,
				id : pageContent._id,
				link : 'http://192.168.1.10:3001/preview?id=' + pageContent._id,
				title : pageContent.title
			}
		}
	}

	const result = yield pageModel.find({});
	return this.body = {
		code : 1,
		data : {
			lists : result || [],
			count : result.length || 0
		}
	}
}
