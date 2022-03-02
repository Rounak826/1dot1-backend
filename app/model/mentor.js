const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema({
	user_id: { type: String, required: true, unique: true },
	name: { type: String, default: null },
	email:{ type: String, default: null },
	mobile_no: { type: String, default: null },
	dob: { type: String, default: null },
	gender: { type: String, default: null },
	language: { type: String, default: null },
	about: { type: String, default: null },
	city: { type: String, default: null },
	current_job: { type: String, default: null },
	experience: { type: String, default: null },
	education: { type: String, default: null },
	skills: { type: String, default: null },
	achivement: { type: String, default: null },
	opinion_about_1dot1: { type: String, default: null },
	prefered_time: { type: String, default: null },
	expected_fee: { type: String, default: null },
	payment_mode: { type: Object, default: null },
	linkedin: { type: String, default: null },
	instagram: { type: String, default: null },
	facebook: { type: String, default: null },
	twitter: { type: String, default: null },
	profile_pic_source: {data:Buffer,contentType:String},
	resume_source: {data:Buffer,contentType:String },
	status: { type: String, default: null },
	category: { type: String, default: null },
});

module.exports = mongoose.model("mentor", mentorSchema);
