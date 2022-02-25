const mongoose = require("mongoose");

const menteeSchema = new mongoose.Schema({
	user_id: { type: String, required: true, unique: true },
	first_name: { type: String, default: null },
	last_name: { type: String, default: null },
	mobile_no: { type: String, default: null },
	institute_name: { type: String, default: null },
	city: { type: String, default: null },
	state: { type: String, default: null },
	field_intrest: { type: String, default: null },
	institute_name: { type: String, default: null },
});

module.exports = mongoose.model("mentee", menteeSchema);
