var pageModel = require('../model/page');

exports.preview = function * (){
	var ctx = this;
	var body = ctx.request.body;
	console.log(ctx.ip,ctx.ips)
	if(!body.content){
		return this.body = {
			code : 0,
			msg : '内容不能为空'
		}
	}

	var page = new pageModel(body);
	var newObj = yield page.save();
	return this.body = {
		code : 1,
		data : {
			content : newObj.content,
			id : newObj._id,
			link : ctx.request.origin.replace(/(127.0.0.1)/,'192.168.1.52') + '/preview?id=' + newObj._id,
			title : newObj.title
		}
	}
}
