const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const UserSchema = require('../models/user.model');
const User = mongoose.model('users', UserSchema);
const session = require('express-session');
const io = require('socket.io');
const jwt = require('jsonwebtoken');

const UserController = () => {

	function log(msg) {
		console.log('\n-------------------------------------\n\t' + msg + '\n-------------------------------------\n');
	}

	function login(req, res, next) {

		// pegar no email e passwd
		let email = req.body.email || null;
		let passwd = req.body.passwd || null;

		if (!email || !passwd) {
			log('\n-------------------\
			Email e passwd obrigatórios!\n\
			----------------------');
			return res.json({
				success: false,
				msg: 'Email e passwd obrigatórios!'
			});
		}


		/**
		 *
		 * Vai buscar por email e
		 * compara as passwords.
		 *
		 */
		const q = User.findOne({email: email});
		q.exec((err, user) => {
			if (err) {
				log("User Find One Err: " + err)
				return res.json({
					success: false,
					msg: 'BD error: ' + err
				});
			}

			if (!user) {
				log("User not found!");
				return res.json({
					success: false,
					msg: "User not found."
				});
			}

			log("Server got:\n\tEmail: " + email + "\n\tPassword: " + passwd);
			setTimeout(() => {
				log("Syncing secret hash into bcrypt algorithm");
				bcrypt.hashSync(req.app.get('secret'));

				setTimeout(() => {

					log("Comparing encrypted passwords...");
					bcrypt.compare(passwd, user.passwd, (err, success) => {
						if (err) {
							log("Compare method failed...")
							return res.json({
								success: false,
								msg: 'Compare method failed...'
							});
						}
						
		
						if (!success) {
							log("Error. Invalid password!");
							return res.json({
								success: false,
								msg: 'Error. Invalid password!'
							});
						}
						
						const payload = {
							user: email
						};
						const token = jwt.sign(payload, req.app.get('secret'), {
							expiresIn: "24h" // expires in 24 hours
						});
						log("Success! You have been logged in...");
						return res.json({
							success: true,
							msg: "Success! You have been logged in...",
							response: {
								email: user.email,
								passwd: user.passwd,
								salt: user.salt,
							},
							token: token
						});
					})
				}, 1500);
			}, 1500);
			
		});

	}

	function signup(req, res, next) {

		let email = req.body.email;
		let passwd = req.body.passwd;
		let rounds = 10;

		if (!email || !passwd) {
			log('\n-------------------\
			Email e passwd obrigatórios!\n\
			----------------------');
			return res.json({
				success: false,
				msg: 'Email e passwd obrigatórios!'
			});
		}

		log("Server got:\n\tEmail: " + email + "\n\tPassword: " + passwd);
		
		setTimeout(() => {

			log("Syncing secret key with bcrypt hash algorythm...");
			bcrypt.hashSync(req.app.get('secret'));

			setTimeout(() => {
				log("Generating salt...");
				bcrypt.genSalt(rounds, (err, salt) => {
					if (err) {
						log("Error generating salt... " + err);
						return res.json({
							success: false,
							msg: "Error generating salt... " + err
						});
					}
					
					setTimeout(() => {
						log("Salt: " + salt);

						setTimeout(() => {
							log("Hashing password with salt...");
							bcrypt.hash(passwd, salt, null, (err, hashedPasswd) => {

								if (err) {
									log("Error generating salt... " + err);
									return res.json({
										success: false,
										msg: "BD error: " + err
									});
								}
				
								// Guardar na bd
								let user = new User({
									email: email,
									passwd: hashedPasswd,
									salt: salt,
									rounds: rounds
								});
								
								setTimeout(() => {
									user.save((err) => {
										if (err) {
											log("Error saving user in database... " + err);
											return res.json({
												success: false,
												msg: "BD error: " + err
											});
										}

										const payload = {
											user: email
										};
										const token = jwt.sign(payload, req.app.get('secret'), {
											expiresIn: "24h" // expires in 24 hours
										});
										
										log(`User successfully saved in database.
										\n\tEmail: ${email}
										\n\tPassword: ${passwd}
										\n\tSalt: ${salt}
										\n\tHashedPasswd: ${hashedPasswd}`);
										res.json({ 
											success: true,
											msg: "User saved in database successfully!",
											token: token
										});
									});
								}, 1500);
							});
						}, 1500);
					}, 1500);
				});
			}, 1500);
		}, 1500);
	}

	return {
		login: login,
		signup: signup
	}
}

module.exports = UserController();