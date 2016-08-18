var pageModel = require('../model/page');

exports.home = function * (){
	var ctx = this;
	yield ctx.render('layout',{
		title : '生成器-拖出你的页面',
		pageId : 1
	})
}

exports.preview = function * (){
	var ctx = this;
	var body = ctx.request.query;
	if(!body.id) return ;

	var result = yield pageModel.findOne({'_id':body.id});
	yield ctx.render('preview',{
		title : result.name,
		id : result._id,
		content : result.content
	})
}
