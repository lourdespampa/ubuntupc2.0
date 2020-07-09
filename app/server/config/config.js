'use-strict';
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const config = {
	development: {
		//db: 'mongodb://localhost/yo-express-development',
		db: 'mongodb://data1:123456@ds147167.mlab.com:47167/dbcrud'
		// db: 'mongodb://localhost/db-app'
	},
	test: {
		db: 'mongodb://localhost/yo-express-test'
	},
	production: {
		// db: 'mongodb://mongodb:27017/yo-express-production' //funciona
		db: 'mongodb://mongodb/yo-express-production5' // tambien funciona
	}
};

module.exports = config[env];
