const Login = require('../models/LoginModel');

exports.index = (req, res) => {
	if (req.session.user) return res.render('login-logado');
	return res.render('login');
};

exports.register = async function (req, res) {
	try {
		const login = new Login(req.body); // crio uma instância chamando a classe criada no Model
		await login.register(); // esse método valida os registros no model

		if (login.errors.length > 0) {
			req.flash('errors', login.errors); // chamamos o req.flash com o login.errors
			req.session.save(function () {
				// salvamos a session redirecionando de onde veio
				return res.redirect('/login/index'); // retornou de onde veio o redirecionamento
			});
			return;
		}

		req.flash('success', 'Seu usuário foi criado com sucesso.'); // chamamos o req.flash com o login.errors
		req.session.save(function () {
			return res.redirect('/login/index'); // salvamos a session redirecionando de onde veio
		});
	} catch (e) {
		console.log(e);
		return res.render('404');
	}
};

exports.login = async function (req, res) {
	try {
		const login = new Login(req.body); // crio uma instância chamando a classe criada no Model
		await login.login(); // esse método valida os registros no model

		if (login.errors.length > 0) {
			req.flash('errors', login.errors); // chamamos o req.flash com o login.errors
			req.session.save(function () {
				// salvamos a session redirecionando de onde veio
				return res.redirect('/login/index'); // retornou de onde veio o redirecionamento
			});
			return;
		}

		req.flash('success', 'Login efetuado.'); // chamamos o req.flash com o login.errors
		req.session.user = login.user; // sessao de cookie
		req.session.save(function () {
			return res.redirect('/login/index'); // salvamos a session redirecionando de onde veio
		});
	} catch (e) {
		console.log(e);
		return res.render('404');
	}
};

exports.logout = function (req, res) {
	req.session.destroy();
	res.redirect('/');
};
