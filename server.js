// 11:26

require('dotenv').config(); // variáveis de ambiente

const express = require('express');
const app = express();

const mongoose = require('mongoose');

mongoose
	.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
	.then(() => {
		console.log('Conectei a Base de dados');
		app.emit('Pronto');
	})
	.catch((e) => console.log(e));

const session = require('express-session'); // sessões para identificar o navegador de um cliente
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');

const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
	secret: 'uahjsaasd78sd65f7s68asd7s4578s9asdasd7s6a7d68as',
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7,
		httpOnly: true,
	},
});

app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());

app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);

app.use(routes);

app.on('Pronto', () => {
	app.listen(3000, () => {
		console.log('Servidor inciado em http://localhost:3000');
	});
});
