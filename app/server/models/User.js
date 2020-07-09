	const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
		name:String,
		provider:String,
		provider_id:String,
		photo:String,
		createAt:{type:Date, default:Date.now}
},{
		collection:"users"
});

module.exports = mongoose.model("users", userSchema);
