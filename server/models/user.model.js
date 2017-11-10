const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		required: true
	},
	passwd: String,
	salt: String,
	rounds: Number
});

module.exports = UserSchema;