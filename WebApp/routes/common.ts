
const express = require('express');

const lusca = require('lusca');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, 'uploads') });

export class Common {
	webApp;
	constructor(webApp) {
		this.webApp = webApp;
	}
	config() {
		var router = express.Router();

		router.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
		router.use('/js/lib', express.static(path.join(__dirname, 'node_modules/chart.js/dist'), { maxAge: 31557600000 }));
		router.use('/js/lib', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'), { maxAge: 31557600000 }));
		router.use('/js/lib', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'), { maxAge: 31557600000 }));
		router.use('/js/lib', express.static(path.join(__dirname, 'node_modules/jquery/dist'), { maxAge: 31557600000 }));
		router.use('/webfonts', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'), { maxAge: 31557600000 }));

		return router;

	}
	isAuthenticated(req, res, next) {
		console.log("isAuthenticated:", req.path);
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect('/login');
	}
}

export function config(webApp) {
	console.log("common config");
	var router = express.Router();

	router.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
	router.use('/js/lib', express.static(path.join(__dirname, 'node_modules/chart.js/dist'), { maxAge: 31557600000 }));
	router.use('/js/lib', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'), { maxAge: 31557600000 }));
	router.use('/js/lib', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'), { maxAge: 31557600000 }));
	router.use('/js/lib', express.static(path.join(__dirname, 'node_modules/jquery/dist'), { maxAge: 31557600000 }));
	router.use('/webfonts', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'), { maxAge: 31557600000 }));

	return router;
}