const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const UserSchema = require('../models/user.model');
const User = mongoose.model('users', UserSchema);
const secret = require('./secret');

const authController = (socket) => {

	function alertWhatServerGot(msg) {
		return new Promise( (resolve, reject) => {
			setTimeout(() => {
				socket.emit('login', {
					success: true,
					msg: "Server got: email -> " + msg.email + " | password -> " + msg.passwd
				})
				console.log("Telling client what server got...")
				resolve();
			}, 1500); 
		})
	}

	async function login(msg) {
		
		
		const email = msg.email || null;
		const passwd = msg.passwd || null;
		
		if (!email || !passwd) {
			return socket.emit('login', {
				success: false,
				msg: "Email or password not sent to server!"
			});
		}
		
		await alertWhatServerGot(msg);

		const q = User.findOne({email: email});
		q.exec((err, user) => {

			setTimeout(() => {

				if (err) {
					console.log("User Find One Err: " + err)
					return socket.emit('login', {
						success: false,
						msg: 'BD error: ' + err
					});
				}
	
				if (!user) {
					return socket.emit('login', {
						success: false,
						msg: "User not found."
					});
				}
				socket.emit('login', {
					success: true,
					msg: 'User found...'
				})
				
				setTimeout(() => {

					socket.emit('login', {
						success: true,
						msg: 'Syncing bcrypt hash with the secret password...'
					})
					bcrypt.hashSync(secret.secret);
					bcrypt.compare(passwd, user.passwd, (err, success) => {
						if (err) {
							return socket.emit('login', {
								success: false,
								msg: 'Compare failed'
							});
						}
						
						setTimeout(() => {
							socket.emit('login', {
								success: true,
								msg: 'Comparing user password with given password...'
							});
							console.log('Comparing user password with given password...')
							if (!success) {
								console.log('Password not correct.')
								return socket.emit('login', {
									success: false,
									msg: 'Password not correct.'
								});
							}
			
							setTimeout(() => {
								console.log('User logged in successfully!')
								return socket.emit('login', {
									success: true,
									msg: "User logged in successfully!",
									response: {
										email: user.email,
										passwd: user.passwd,
										salt: user.salt
									}
								});
							}, 1000);
						}, 1000);
					})
				}, 1500);
				
			}, 1000);
		});
	}

	return {
		login: login
	}
}

module.exports = authController;