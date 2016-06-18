const Authentication = require('./controllers/authentication');
const Todos = require('./controllers/todos');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
	app.get('/', Authentication.test);
	app.get('/secret', requireAuth, function(req, res) {
		res.send({ message: 'Super secret code is ABC123' });
	});
	app.post('/signin', requireSignin, Authentication.signin);
	app.post('/signup', Authentication.signup);
	app.get('/todos', requireAuth, Todos.getList);
	app.post('/todos', requireAuth, Todos.create);
	app.post('/clear', requireAuth, Todos.clear);
	app.get('/todo/:id', requireAuth, Todos.getTodo);
	app.put('/todo/:id', requireAuth, Todos.update);
	app.delete('/todo/:id', requireAuth, Todos.delete);
}
