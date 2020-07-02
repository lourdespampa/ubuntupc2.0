/* 
  API 
*/

const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Contact = require('../models/contact');

/*
	Using router:

	-- File:  /routes/api.js --
	router.get('/', (req, res, next) => {
		res.render('index', {
			title:"API"
		});
	});

	-- File:  app.js --
	var api = require('./routes/api');
	app.use('/', api);

*/
/*
	Using "exports".
*/

// --- GET ---  contact
exports.getIndex = (req, res, next) => {
		res.render('index', {
				title:"Index"
		});
};

exports.getLogin = (req, res,next) => {
	res.render('login',{
		title:"Login"
	})
}
/** Buscador */

exports.getUsers = async (req, res, next) => {
	const search = req.query.search
	if(search){
		const result = await Contact.find({$or:[{nombre:{$regex:search}}, {apellido:{$regex:search}}]}).sort({nombre:1})
		return res.render('users', {
			title:'busqueda',
			data:result || []
		})
	}
	Contact.find()
			.limit()
			.sort()
			.exec((err, data) => {
					res.render('users', {
							title : "Usuarios",
							data : data
					});
			});	
};

exports.getCreateUser = (req, res ,next) => {
		res.render('create', {
				title:"Crear contacto"
		});
};

exports.getUserDetails = (req, res, next) => {
		Contact.findById(req.params.id)
				.limit()
				.sort()
				.exec((err, data) => {
						res.render('user-details', {
								title : "Detalles",
								data : data
						});
				});
};

exports.getEditUser = (req, res, next) => {
		Contact.findById(req.params.id)
				.exec((err, data) => {
					res.render('edit', {
							title : "Editar contacto",
							data : data
					});
				});
};

exports.getJson = (req, res, next) => {
		Contact.find()
				.exec((err, data) => {
						res.json(data);
				});
};
//--- POST ---
exports.postCreateUser = (req, res, next) => {
		const user = new Contact({
				nombre: req.body.nombre,
				apellido: req.body.apellido,
				email: req.body.email,
				imagen:req.body.imagen,
				fecha_nacimiento:req.body.fecha_nacimiento
		});

		user.save();
		res.redirect("/users");
};

// --- PUT ---
exports.putEditUser = (req, res, next) => {
		Contact.findById(req.params.id)
				.limit()
				.sort()
				.exec((err, data) => {
					data.nombre = req.body.nombre
					data.apellido = req.body.apellido,
					data.email = req.body.email,
					data.imagen = req.body.imagen,
					data.fecha_nacimiento = req.body.fecha_nacimiento

					data.save();
					res.redirect('/user/' + req.params.id);
				});
};

// --- DELETE ---
exports.deleteUser = (req, res, next) => {
		Contact.findByIdAndRemove(req.params.id)
				.exec((err, data) => {
						res.redirect('/users');
				});
};



