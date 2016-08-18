// const app = require('koa')();
// const router = require('koa-router');
// const views = require('koa-views');
// const convert = require('koa-convert')
// const path = require('path');
// const morgan = require('koa-morgan')
var app = require('koa')(),
    Router = require('koa-router');
var staticServer = require('koa-static')
var render = require('koa-ejs');
var mongoose = require('mongoose');
var config = require('./config')
var routerConfig = require('./routes');
var koaBody   = require('koa-body');
var bodyParser = require('koa-bodyparser');
const path = require('path');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://" + config.DB.HOST + ":" + config.DB.PORT + "/" + config.DB.NAME)

var routers = new Router();
routerConfig(routers);
// api = router();
// app.use(koaBody({formidable:{uploadDir: __dirname}}));
app.use(bodyParser());
app.use(staticServer(__dirname + '/public'))
render(app, {
    	root: path.join(__dirname, 'public/page'),
    	viewExt: 'html',
   	  cache: false,
    	debug: true
});

// api.get('/', function*(ctx,next) {
// 	yield this.render('/layout',{
// 		title:'首页',
// 		pageId : 1,
// 		username:111,
// 	});
// });

app
    .use(routers.routes())
    .use(routers.allowedMethods());

app.listen(3001, function(res) {
  console.log('listen port 3001,palease oepn browser 127.0.0.1:3001')
});
