const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const UserSchema = require('../models/user.model');
const User = mongoose.model('users', UserSchema);
const session = require('express-session');

const UserController = () => {

	function login(req, res, next) {

		// pegar no email e passwd
		let email = req.body.email;
		let passwd = req.body.passwd;

		if (!email || !passwd) return res.send('Email e passwd obrigatórios!');


		/**
		 *
		 * Vai buscar por email e
		 * compara as passwords.
		 *
		 */
		User.findOne({email: email}).exec((err, user) => {
			if (err) return res.send('Não existe email na bd.');

			bcrypt.hashSync(req.app.get('secret'));
			bcrypt.compare(passwd, user.passwd, (err, success) => {
				if (err) return res.send('Compare failed');

				if (!success) return res.send('Erro, palavra-passe não está correta!');

				/**
				 *
				 * Save session data.
				 *
				 */
				session.email = user.email;
				session.passwd = user.passwd;
				session.passwdsalt = user.salt;

				return res.render('login');
			})
			
		});

	}

	function register(req, res, next) {

		let email = req.body.email;
		let passwd = req.body.passwd;
		let passwd2 = req.body.passwd2;
		let rounds = 5;

		if (passwd !== passwd2) return res.send('passwrods não coincidem');

		bcrypt.hashSync(req.app.get('secret'));
		bcrypt.genSalt(rounds, (err, salt) => {
			if (err) return res.send(err);

			bcrypt.hash(passwd, salt, null, (err, hashedPasswd) => {

				// Guardar na bd
				let user = new User({
					email: email,
					passwd: hashedPasswd,
					//salt: salt,
					rounds: rounds
				});

				user.save((err) => {
					if (err) return res.send("BD error: " + err);
				});

				res.render('register', { 
					passwd: passwd,
					salt: salt,
					hashedPasswd: hashedPasswd 
				});
			});
		});
	}

	return {
		login: login,
		register: register
	}
}

module.exports = UserController();