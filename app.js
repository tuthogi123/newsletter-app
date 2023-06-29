// import required packages
const express = require("express");
const https = require("https");
const bodyparser = require("body-parser");

const app = express();
app.use(express.static("public"));

app.use(bodyparser.urlencoded({ extended: true }));

// On the home route, send signup html template
app.get("/", function (req, res) {
	res.sendFile(__dirname + "/signup.html");
});

// Manage post request on home route and
// Send data to the MailChimp account via API
app.post("/", function (req, res) {
	var firstName = req.body.Fname;
	var email = req.body.Email;
	var password = req.body.password;

	var data = {
		members: [{
			email_address: email,
			status: "subscribed",
			merge_fields: {
				FNAME: firstName,
				LNAME: password
			}
		}]
	}

	// Converting string data to JSON data
	const jsonData = JSON.stringify(data);
	const url = "https://us14.api.mailchimp.com/3.0/lists/35844537a8";
	const options = {
		method: "POST",
		auth: " 35844537a8:64dea49f14e52b49ecea0d2a5af4e74b-us21"
	}

	// On success send users to success, otherwise on failure template
	const request = https.request(url, options, function (response) {
		if (response.statusCode === 200) {
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/failure.html");
		}
		response.on("data", function (data) {
			console.log(JSON.parse(data));
		});
	});
	request.write(jsonData);
	request.end();
});

// Failure route
app.post("/failure", function (req, res) {
	res.redirect("/");
})

app.listen(8000, function () {
	console.log("server is running on port 8000.");
})
console.log("okay")