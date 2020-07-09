/* 
  API 
*/

const Contact = require('../models/contact');

const cloudinary = require('cloudinary').v2;


cloudinary.config({
  cloud_name: "detp1ndiv",
  api_key: "872757179686838",
  api_secret: "PuO1XxRCezu1Jk-2tLHAS2FyE4A"
});


/*
	Using "exports".
*/

// --- GET ---  contact
exports.getIndex = async (req, res, next) => {
		if(req.user){
			return res.render('index', {
				title:"Index",
				name: req.user.name
			});
		}
		res.render('index', {
			title:"Index",
			name:''
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
		const result = await Contact.find({$or:[{nombre:{$regex:search, $options:'i'}}, {apellido:{$regex:search, $options:'i'}}]}).sort({nombre:1})
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
		let filename = req.files.image
		let path = `./uploads/${filename.name}`
		filename.mv(path)
		cloudinary.uploader.upload(path,{ tags: "gotemps",resource_type: "auto" })
		.then(function(file) {
			console.log("Public id  " + file.public_id);
			console.log("Url of image " + file.url);

			const user = new Contact({
				nombre: req.body.nombre,
				apellido: req.body.apellido,
				email: req.body.email,
				imagen:file.url,
				fecha_nacimiento:req.body.fecha_nacimiento
		});

		user.save();
		res.redirect("/users");
			
		}).catch(function(err) {
			if (err) {console.warn(err);}
		});
		
		
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



