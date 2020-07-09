const User = require('../models/User') // cambiar
const refresh = require('passport-oauth2-refresh');
const moment = require('moment')
const FacebookStrategy = require('passport-facebook').Strategy;
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');

const config = {
  facebook:{
    id:'274530206949364',
    secret:'f2ad2c610c1985e7476a6a448713ca9f'
	},
	google:{
		id:"946007665180-4v0g6enbo7dmk01k7q9hs3pdbnucevlv.apps.googleusercontent.com",
		secret:"OvNVuJJEce4PkdKh-Ut8au7F"
	}
}

module.exports = function(passport){
  // Serializa al usuario para almacenarlo en la sesión
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	
	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
	const googleStrategyConfig = new GoogleStrategy({
		clientID: config.google.id,
		clientSecret: config.google.secret,
		callbackURL: '/auth/google/callback',
		passReqToCallback: true
	}, (req, accessToken, refreshToken, params, profile, done) => {
		if (req.user) {
			User.findOne({ google: profile.id }, (err, existingUser) => {
				if (err) { return done(err); }
				if (existingUser && (existingUser.id !== req.user.id)) {
					req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
					done(err);
				} else {
					User.findById(req.user.id, (err, user) => {
						if (err) { return done(err); }
						user.google = profile.id;
						user.tokens.push({
							kind: 'google',
							accessToken,
							accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
							refreshToken,
						});
						user.profile.name = user.profile.name || profile.displayName;
						user.profile.gender = user.profile.gender || profile._json.gender;
						user.profile.picture = user.profile.picture || profile._json.picture;
						user.save((err) => {
							req.flash('info', { msg: 'Google account has been linked.' });
							done(err, user);
						});
					});
				}
			});
		} else {
			User.findOne({ google: profile.id }, (err, existingUser) => {
				if (err) { return done(err); }
				if (existingUser) {
					return done(null, existingUser);
				}
				User.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
					if (err) { return done(err); }
					if (existingEmailUser) {
						req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
						done(err);
					} else {
						const user = new User();
						user.email = profile.emails[0].value;
						user.google = profile.id;
						user.tokens.push({
							kind: 'google',
							accessToken,
							accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
							refreshToken,
						});
						user.profile.name = profile.displayName;
						user.profile.gender = profile._json.gender;
						user.profile.picture = profile._json.picture;
						user.save((err) => {
							done(err, user);
						});
					}
				});
			});
		}
	});
	passport.use('google', googleStrategyConfig);
	refresh.use('google', googleStrategyConfig);

  passport.use(new FacebookStrategy({
		clientID			: config.facebook.id,
		clientSecret	: config.facebook.secret,
		callbackURL	 : '/auth/facebook/callback',
		profileFields : ['id', 'displayName', /*'provider',*/ 'photos']
	}, function(accessToken, refreshToken, profile, done) {
		// El campo 'profileFields' nos permite que los campos que almacenamos
		// se llamen igual tanto para si el usuario se autentica por Twitter o
		// por Facebook, ya que cada proveedor entrega los datos en el JSON con
		// un nombre diferente.
		// Passport esto lo sabe y nos lo pone más sencillo con ese campo
		User.findOne({provider_id: profile.id}, function(err, user) {
			if(err) throw(err);
			if(!err && user!= null) return done(null, user);

			// Al igual que antes, si el usuario ya existe lo devuelve
			// y si no, lo crea y salva en la base de datos
			var user = new User({
				provider_id	: profile.id,
				provider		 : profile.provider,
				name				 : profile.displayName,
				photo				: profile.photos[0].value
			});
			req.user = user
			user.save(function(err) {
				if(err) throw err;
				done(null, user);
			});
		});
	}));
}


