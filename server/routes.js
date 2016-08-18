const Components = require('./controllers/componetController')
const Page = require('./controllers/pageController')
const Home = require('./controllers/homeController')

module.exports = function(router){
	router.get('/',Home.home)
	router.get('/preview',Home.preview)

	router.get('/components/get',Components.get)
	router.post('/components/add',Components.add)
	router.post('/page/preview',Page.preview)
}
