// var homeModel = require('../model/home');

exports.home = function * (){
	var ctx = this;
	yield ctx.render('index',{
		title : '生成器-拖出你的页面',
		pageId : 1
	})
}
