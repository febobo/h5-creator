const koaBetterBody = require('koa-better-body')
const Components = require('./controllers/componetController')
const Page = require('./controllers/pageController')
const Home = require('./controllers/homeController')

module.exports = function(router) {
  router.get('/', Home.home)
  router.get('/preview', Home.preview)

  router.get('/components/get', Components.get)
  router.post('/components/add', Components.add)
  router.post('/components/loadfile', Components.loadfile)
  router.post('/page/preview', Page.preview)
  router.get('/page/preview', Page.getPagelist)
  router.post('/components/delete', Components.delete)
  router.post('/page/delete', Page.delete)
}
