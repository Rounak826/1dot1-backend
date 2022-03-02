const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
	category: { type: String, default: null},
	mentors: { type: Array, default: null}
});

module.exports = mongoose.model("category", categorySchema);
