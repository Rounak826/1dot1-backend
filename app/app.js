require("dotenv").config();
require("./config/database").connect();
const express = require("express");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./model/user");
const Mentor = require("./model/mentor");
const Mentee = require("./model/mentee");
const cors = require('cors')
const app = express();

app.use(express.json());
app.use(cors())
app.get("/", function (req, res) {
	res.send({ error: "TRUE", message: "Invalid Request" });
});

/* USER LOGIN */
app.post("/user/login", async (req, res) => {
	try {
		const { email_id, password } = req.body;
		if (!(email_id && password)) {
			res.send({ error: "TRUE", message: "All input required" });
		}

		const user = await User.findOne({ email_id });

		if (user && (await bcrypt.compare(password, user.password))) {
			const token = jwt.sign(
				{
					user_id: user._id,
					email_id: user.email_id,
				},
				process.env.JWT_KEY,
				{
					expiresIn: "1h",
				}
			);
			res.send({
				status:200,
				error: false,
				message: "SUCCESS",
				user: user,
				token: token,
			});
		} else {
			res.send({ status:400,error: true, message: "Incorrect user id / password" });
		}
	} catch (error) {
		res.send({ error: "TRUE", message: error.message });
	}
});

/* USER REGISTRATION */
app.post("/user/register", async (req, res) => {
	console.log(req.body)
	let status = false;
	try {
		const { email_id, password, role } = req.body;
		if (!(email_id && password && role)) {
			res.send({ status:400,error: true, message: "All input required" });
		}

		const oldUser = await User.findOne({ email_id });

		if (oldUser) {
			res.send({status:400, error: true, message: "Given email id already exist" });
		} else {
			encryptedPassword = await bcrypt.hash(password, 10);

			const user = await User.create({
				email_id: email_id.toLowerCase(),
				password: encryptedPassword,
				role,
				status,
			});

			const token = jwt.sign(
				{
					user_id: user._id,
					email_id: user.email_id,
				},
				process.env.JWT_KEY,
				{
					expiresIn: "1h",
				}
			);

			res.send({
				status: 200,
				error: false,
				message: "SUCCESS",
				user: user,
				token: token,
			});
		}
	} catch (error) {
		res.send({ status: 400,error: true, message: error.message });
	}
});

/* MENTOR PROFILE */
app.post("/mentor/profile", async (req, res) => {
	try {
		const reqData = req.body;
		const data = await Mentor.create(reqData);

		res.send({ status:200, error: false, message: "SUCCESS" });
	} catch (error) {
		res.send({ status:400,error: true, message: error.message });
	}
});

/* MENTEE PROFILE */
app.post("/mentee/profile", async (req, res) => {
	try {
		const reqData = req.body;
		const data = await Mentee.create(reqData);

		res.send({ status:200, error: false, message: "SUCCESS" });
	} catch (error) {
		res.send({ status:400,error: true, message: error.message });
	}
});

module.exports = app;
