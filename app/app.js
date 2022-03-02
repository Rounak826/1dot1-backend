require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bodyParser = require('body-parser');
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./model/user");
const Mentor = require("./model/mentor");
const Mentee = require("./model/mentee");
const Category = require("./model/category");
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
				status: 200,
				error: false,
				message: "SUCCESS",
				user: user,
				token: token,
			});
		} else {
			res.send({ status: 400, error: true, message: "Incorrect user id / password" });
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
			res.send({ status: 400, error: true, message: "All input required" });
		}

		const oldUser = await User.findOne({ email_id });

		if (oldUser) {
			res.send({ status: 400, error: true, message: "Given email id already exist" });
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
		res.send({ status: 400, error: true, message: error.message });
	}
});
/* USER UPDATE */
app.post("/user/update", async (req, res) => {
	console.log(req.body)
	try {
		const { _id, name, mobile_no, email_id, password, role } = req.body;
		const User = await User.findOne({ _id });
		if (User) {
			const user = await User.updateOne(
				{ _id: User._id },
				{
					$set: {
						email_id: email_id ? email_id.toLowerCase() : User.email_id,
						password: password ? await bcrypt.hash(password, 10) : User.password,
						role: role ? role : User.role,
						name: name ? name : User.name,
						mobile_no: mobile_no ? mobile_no : User.mobile_no,
						status: User.status
					}
				}
			);
			res.send({ status: 200, error: false, message: 'record updated successfully', result: 'record updated successfully' })

		} else {
			res.send({ status: 404, error: true, message: 'No User found in our records', result: 'No User found in our records' });
		}
	} catch (error) {
		res.send({ status: 400, error: true, message: error.message });
	}
});
/* MENTOR PROFILE */
app.post("/mentor/profile", async (req, res) => {
	try {
		const reqData = req.body;
		reqData.status = "false";
		const data = await Mentor.create(reqData);

		res.send({ status: 200, error: false, result: "Saved Your Information Successfully", message: 'Success' });
	} catch (error) {
		res.send({ status: 400, error: true, result: 'Could not Save Your Information', message: error.message });
	}
});
/* MENTOR PROFILE */
app.post("/mentee/profile", async (req, res) => {
	try {
		const reqData = req.body;
		reqData.status = "false";
		const data = await Mentee.create(reqData);

		res.send({ status: 200, error: false, result: "Saved Your Information Successfully", message: 'Success' });
	} catch (error) {
		res.send({ status: 400, error: true, result: 'Could not Save Your Information', message: error.message });
	}
});

/* MENTOR Requests */
app.get("/mentor-requests", async (req, res) => {
	try {
		const mentor_requests = await Mentor.find({status: "false"});
		res.send(mentor_requests);
	} catch {
		res.send([]);
	}
});
/* LIST CATEGORY*/
app.get("/list/category", async (req, res) => {
	try {
		const category_list = await Category.find();
		res.send(category_list);
	} catch {
		res.send([]);
	}
});
/* ADD NEW CATEGORY */
app.post("/add/category", async (req, res) => {
	let reqData = req.body;
	if(reqData.category){
		try {
			let old = await Category.findOne({category:reqData.category});
			if(old){
				res.send({status: 400, error: true, result: 'Category Already Exists', message: 'Failure'});
			}
			const category_list = await Category.create(reqData);
			res.send({status: 200, error: false, result: 'New Category Added', message: 'Success', data: category_list});
		} catch(error) {
			res.send({status: 400, error: true, result: 'Could not add new category', message:error.message, data:reqData.body  });
		}
	}else{
		res.send({status: 500, error: true, result: 'Please Enter Valid Value', message: 'Error', data: "Bad Request"  });
	}
	
});
/* ADD NEW MENTOR TO CATEGORY */
app.post("/push/category/mentor", async (req, res) => {
	let reqData = req.body;
	if(reqData.category&&reqData.mentor){
		try {
			const found = await Category.findOne({category:reqData.category})
			if(found){
				const category = await Category.updateOne(
					{category:reqData.category},
					{
						$push : {
							mentors : reqData.mentor
						}
					}
					);
				res.send({status: 200, error: false, result: 'Mentor assigned to category', message: 'Success', data: category});
			}else{
				res.send({status: 400, error: true, result: 'Category Not Found', message: 'Error'  });
			}
			
			
		} catch(error) {
			res.send({status: 400, error: true, result: 'Could not assign Mentor to category', message: 'Error', data: error.message  });
		}
	}else{
		res.send({status: 500, error: true, result: 'Please Enter Valid Value', message: 'Bad Request Error', data: reqData  });
	}
	
});
/*fetch MENTOR profile*/
app.post("/mentor", async (req, res) => {

	try {
		const { id } = req.body;
		console.log(req.body);
		const mentor_profile = await Mentor.findOne({ user_id: id });

		if (mentor_profile) {
			res.json(
				{ status: 200, error: false, result: 'Mentor Found', message: 'Success', data: mentor_profile }
			);
		} else {
			res.send({ status: 404, error: true, result: 'Mentor Not Found', message: 'Mentor Not Found' });
		}


	} catch (error) {
		res.send({ status: 400, error: true, result: 'Could not fetch user', message: error.message });
	}
});

/* RESPOND MENTOR Requests */
app.post("/mentor-requests/respond", async (req, res) => {
	const { mentor_id, admin_id, response } = req.body;
	if (mentor_id && admin_id && response) {
		try {
			const mentor = await Mentor.findOne({ user_id: mentor_id });
			
			if (mentor) {
				const user = await Mentor.updateOne(
					{ user_id: mentor_id },
					{
						$set: {
							status: response,
						}
					}
				);
			}


			res.send({ status: 200, error: false, result: "Mentor's Request Responded", message: 'Success' });
		} catch (error) {
			res.send({ status: 400, error: true, result: "Failed to respond Mentor's Request", message: error.message });
		}
	} else {
		res.send({ status: 500, error: true, result: "Bad Request", message: 'Error: Bad Request' });
	}

});
app.get("/user/overview", async (req, res) => {
	try{
		let overview;
	const mentorCount  = await User.countDocuments({role:"mentor"});
	const menteeCount = await User.countDocuments({role:"mentee"});
	overview = {mentorCount, menteeCount};
	res.send({status: 200 , data:overview, error:false, result:"SUCCESS",message:"SUCCESS"});

	}catch (e){
		res.send({status: 400 , data:overview, error:true, result:"FAILED",message:e.message});
	
	}
	

});

module.exports = app;
