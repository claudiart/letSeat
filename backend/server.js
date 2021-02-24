const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.set("view engine", "hbs"); // hbs dateien statt html 
const viewsPath = path.join(__dirname, "views"); // __dirname und views zusammenfassen als String
app.set("views", viewsPath); // views in ViewsPath 
app.use(express.static(path.join(__dirname, 'public'))); // 

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); // Middleware
app.use(bodyParser.json());

const PORT = 3000;
app.listen(PORT, () => console.log("Server Start at the Port " + PORT));

//render register on start page (change this later to login)
app.get('/', (req, res) => {
	res.render('login')
})

app.get('/register', (req, res) => {
	res.render('register')
})

//Endpoint for getting all places
app.get("/places", getAllPlaces);

function getAllPlaces(req, res) {
	var data = fs.readFileSync('./places.json');
	var places = JSON.parse(data);
	if (places) {
		res.json(places);
	} else {
		res.send("No places found");
	}
}

//Endpoint for getting a single place by name
app.get('/places/:place/', searchPlace);

function searchPlace(req, res) {
	var name = req.params.place.toLowerCase();
	var data = fs.readFileSync('./places.json');
	var places = JSON.parse(data);
	if (places[name]) {
		res.json(places[name]);
	} else {
		res.send("Place not found");
	}
}

//Endpoint for user registration
app.post('/user', registerUser);

function registerUser(req, res) {
	var newUser = req.body; //get user object from the request body and save it to newUser
	if (newUser.username && newUser.email && newUser.pass) { //if username, email and pass are truthy ...
		fs.readFile('users.json', function (err, data) { // ...read existing users data from users.js..
			var users = JSON.parse(data); // ...parse that data to a JS object and save it to users...
			users.push(newUser); //...push newUser to users array...
			fs.writeFile('users.json', JSON.stringify(users), (err) => { //stringify users (onverts a JavaScript value to a JSON string) and write it to users.json file
				if (err) { //if there is an error throw error
					throw err
				}
				console.log(newUser.username + " has been added"); //if sucess then console.log this sentence
			});
		});
		res.json(newUser); //send response to client with newUser information
	} else {
		res.send('Failed to add user'); // if username, email and pass are NOT truthy (are missing) send response to client with this sentence
		throw new Error('Failed to add user'); //and throw new error in the backend
	}
}
