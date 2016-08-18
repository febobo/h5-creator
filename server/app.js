const app = require('koa')();
const Router = require('koa-router');
const staticServer = require('koa-static')
const render = require('koa-ejs');
const mongoose = require('mongoose');
const config = require('./config');
const routerConfig = require('./routes');
const koaBody = require('koa-body');
const bodyParser = require('koa-bodyparser');
const path = require('path');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://" + config.DB.HOST + ":" + config.DB.PORT + "/" + config.DB.NAME)

var routers = new Router();
routerConfig(routers);
app.use(bodyParser());
app.use(staticServer(__dirname + '/public'))
render(app, {
  root: path.join(__dirname, 'public/page'),
  viewExt: 'html',
	layout : false,
  cache: false,
  debug: true
});

app
  .use(routers.routes())
  .use(routers.allowedMethods());

app.listen(3001, function(res) {
  console.log('listen port 3001,palease oepn browser 127.0.0.1:3001')
});
