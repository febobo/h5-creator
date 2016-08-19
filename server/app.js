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
const cors = require('koa-cors');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://" + config.DB.HOST + ":" + config.DB.PORT + "/" + config.DB.NAME)

var routers = new Router();
routerConfig(routers);

render(app, {
  root: path.join(__dirname, 'public/page'),
  viewExt: 'html',
  layout: false,
  cache: false,
  debug: true
});

app.use(bodyParser());
app.use(staticServer(__dirname + '/public'))
app.use(cors({
  origin: '*',
  methods: 'GET,PUT,POST,OPTIONS',
  headers: 'Origin, Accept, token, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With'
}));
app
  .use(routers.routes())
  .use(routers.allowedMethods());


app.listen(3001, function(res) {
  console.log('listen port 3001,palease oepn browser 127.0.0.1:3001')
});
