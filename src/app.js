const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const funciones = require('./funciones');


var men;

const directorioPublico = path.join(__dirname, '../public');
const directorioPartials = path.join(__dirname, '../partials');

app.use(express.static(directorioPublico));
hbs.registerPartials(directorioPartials);

app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
	res.render('index');
});



app.get('/crear', (req, res) => {
	res.render('crearCurso');
});


app.post('/crearCurso', (req, res) => {
	curso = {
		nombre: req.body.nombre,
		id: parseInt(req.body.id),
		descripcion: req.body.descripcion,
		valor: parseInt(req.body.valor),
		modalidad: (req.body.modalidad != '') ? req.body.modalidad : '-',
		intensidad: (req.body.intensidad) ? req.body.intensidad : '-',
		estado: req.body.state
	};
	res.render('listarCursos', {
		mensaje: funciones.crearCurso(curso),
		resultado: funciones.listarCursosFormat()
	});
});


app.get('/listarDisponibles', (req, res) => {
	res.render('mostrarCursosDisponibles', {
		cursos: funciones.listarCursosDisponibles()
	});
});


app.get('/inscribir', (req, res) => {
	res.render('inscribirCurso', {
		cursos: funciones.listarCursosDisponibles(),	
	});
});


app.post('/inscribirCurso', (req, res) => {
	inscrito = {
		nombre: req.body.nombre,
		id: parseInt(req.body.id),
		correo: req.body.correo,
		telefono: req.body.telefono,
	};
	curso = {
		idCurso: parseInt(req.body.curso)
	};
	res.render('inscripcion', {
		mensaje: funciones.realizarRegistro(inscrito, curso)
	});
});


app.get('/verInscritos', (req, res) => {
	res.render('listarInscritos', {	
		lista: funciones.verInscritosPorCurso()
	});
});


app.post('/cambiarEstadoCurso', (req, res) => {
	curso = {
		idCurso: parseInt(req.body.idCurso)
	}
	funciones.cambiarEstadoCurso(curso);
	res.render('listarCursos', {
		mensaje: '',
		resultado: funciones.listarCursosFormat()
	});
});



app.post('/eliminarAspirante', (req, res) => {
	matricula = {
		idEst: parseInt(req.body.idEst),
		idCur: parseInt(req.body.idCur)
	}
	funciones.eliminarMatricula(matricula);
	res.render('listarInscritos', {	
		lista: funciones.verInscritosPorCurso()
	});
});


app.get('*', (req, res) => {
	res.render('error');
});


app.listen(3000, () => {
	console.log('Escuchando en el puerto 3000');
});