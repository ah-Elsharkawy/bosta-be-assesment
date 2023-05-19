const User = require("../models/userModel");
const bcrypt = require("bcrypt");

let signup = async (req, res) => {
	console.log("user recieved ...");
	try {
		let { name, email, password } = req.body;
		let user = await User.findOne({ email });

		// checking if user already exists
		if (user) {
			return res.status(400).json({
				message: "User already exists",
			});
		}

		// hashing password
		let salt = await bcrypt.genSalt(10);
		let hashedPswd = await bcrypt.hash(password, salt);

		user = new User({
			name: name,
			email: email,
			password: hashedPswd,
		});
		console.log(user);

		// save user to db
		await user.save().then(() => console.log("user saved successfully"));
		res.status(200).json({
			message: "User created successfully",
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

let login = async (req, res) => {
    try {
		let { email, password } = req.body;
		let user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				message: "User does not exist",
			});
		}

		let isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({
				message: "Incorrect Password",
			});
		}
		res.status(200).json({
			message: "Login Successful",
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Internal Server Error",
		});
	}
}
    

module.exports = {signup, login}