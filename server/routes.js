const Components = require('./controllers/componetController')
const Home = require('./controllers/homeController')

module.exports = function(router){
	router.get('/',Home.home)

	router.get('/components/get',Components.get)
	router.post('/components/add',Components.add)
}
