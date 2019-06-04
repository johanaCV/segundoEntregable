const fs = require('fs');
const path = require('path');

const rutaCursos = path.join(__dirname, '../basedatos/cursos.json');
const rutaUsuarios = path.join(__dirname, '../basedatos/usuarios.json');
const rutaMatriculas = path.join(__dirname, '../basedatos/matriculas.json');

listaUsuarios = [];
listaCursos = [];
listaMatriculas = [];

const crearCurso = (curso) => {
	listarCursos();
	let mensaje;
	let duplicado = listaCursos.find(objEst => objEst.id == curso.id);
	if (!duplicado) {
		listaCursos.push(curso);
		guardarCursos();
		mensaje = '<table width="220" border="0" cellspacing="0" cellpadding="1">\
				   <tr bgcolor="#008000">\
				   <td>\
				   <table width="100%" border="0" cellspacing="0" cellpadding="4">\
				   <tr bgcolor="#BDECB6">\
				   <td>Guardado exitosamente</td>\
				   </tr>\
				   </table>\
				   </td>\
				   </tr>\
				   </table>';		
	}else{
		mensaje = '<table width="220" border="0" cellspacing="0" cellpadding="1">\
				   <tr bgcolor="#990033">\
				   <td>\
				   <table width="100%" border="0" cellspacing="0" cellpadding="4">\
				   <tr bgcolor="#FFA07A">\
				   <td>Ya existe un curso con el id ingresado</td>\
				   </tr>\
				   </table>\
				   </td>\
				   </tr>\
				   </table>';
	}
	return mensaje;
}

const listarCursos = () => {
	try {
		listaCursos = require(rutaCursos);
	} catch(error){
	}
}

const listarCursosFormat = () => {
	listarCursos();
	let texto;
	if (listaCursos.length == 0) {
		texto = '<p>No hay cursos</p>';
	}else{
		texto = "<table>\
				<thead>\
				<th> Id </th>\
				<th> Nombre </th>\
				<th> Descripción </th>\
				<th> Valor </th>\
				<th> Modalidad </th>\
				<th> Intensidad </th>\
				<th> Estado </th>\
				</thead>\
				<tbody>";
		listaCursos.forEach(objCur => {
			texto = texto + 
				'<tr>' + 
				'<td>' + objCur.id + '</td>' +
				'<td>' + objCur.nombre + '</td>' +
				'<td>' + objCur.descripcion + '</td>' +
				'<td>' + objCur.valor + '</td>' +
				'<td>' + objCur.modalidad + '</td>' +
				'<td>' + objCur.intensidad + '</td>' +
				'<td>' + objCur.estado + '</td></tr>';
		});
		texto = texto + '</tbody></table>';
	}
	return texto;
}

const listarCursosDisponibles = () => {
	listarCursos();
	let texto;
	let disponibles = listaCursos.filter(objCur => objCur.estado == 'disponible');
	return disponibles;
}


const guardarCursos = () => {
	let datos = JSON.stringify(listaCursos);
	fs.writeFile(rutaCursos, datos, (err) =>{
		if (err) throw (err);
		console.log('Archivo creado con éxito');
	})
}

const listarUsuarios = () => {
	try {
		listaUsuarios = require(rutaUsuarios);
	} catch(error){
	}
}


const guardarUsuarios = () => {
	let datos = JSON.stringify(listaUsuarios);
	fs.writeFile(rutaUsuarios, datos, (err) =>{
		if (err) throw (err);
		console.log('Archivo creado con éxito');
	})
}

const realizarRegistro = (inscrito, curso) => {
	listarUsuarios();
	let mensaje;
	let existe = listaUsuarios.find(objIns => objIns.id == inscrito.id);
	if (!existe) {
		listaUsuarios.push(inscrito);
		guardarUsuarios();
		mensaje = matricular(matricula = {
											idEst: inscrito.id,
											idCurso: curso.idCurso
										});
	}else{
		mensaje = matricular(matricula = {
									idEst: inscrito.id,
									idCurso: curso.idCurso
							});
	}
	return mensaje;
}

const listarMatriculas = () => {
	try {
		listaMatriculas = require(rutaMatriculas);
	} catch(error){
	}
}

const guardarMatriculas = () => {
	let datos = JSON.stringify(listaMatriculas);
	fs.writeFile(rutaMatriculas, datos, (err) =>{
		if (err) throw (err);
		console.log('Archivo creado con éxito');
	})
}


const matricular = (matricula) => {
	listarMatriculas();
	let mensaje;
	let registro = listaMatriculas.find(objMat => {
		return ((objMat.idEst == matricula.idEst) && (objMat.idCurso == matricula.idCurso));
	});
	if (!registro) {
		listaMatriculas.push(matricula);
		guardarMatriculas();
		mensaje = '<table width="220" border="0" cellspacing="0" cellpadding="1">\
				   <tr bgcolor="#008000">\
				   <td>\
				   <table width="100%" border="0" cellspacing="0" cellpadding="4">\
				   <tr bgcolor="#BDECB6">\
				   <td>Inscrito exitosamente</td>\
				   </tr>\
				   </table>\
				   </td>\
				   </tr>\
				   </table>';		
	}else{
		mensaje = '<table width="220" border="0" cellspacing="0" cellpadding="1">\
				   <tr bgcolor="#990033">\
				   <td>\
				   <table width="100%" border="0" cellspacing="0" cellpadding="4">\
				   <tr bgcolor="#FFA07A">\
				   <td>Ya está inscrito en el curso</td>\
				   </tr>\
				   </table>\
				   </td>\
				   </tr>\
				   </table>';
	}
	return mensaje;
}


function cursoInscritos (nombre, id, estado, estudiantes){
	this.nombre = nombre;
	this.id = id;
	this.estado = estado;
	this.estudiantes = estudiantes.slice();
}


const verInscritosPorCurso = () => {
	listaCursosB = listarCursosDisponibles();
	listarMatriculas();
	listarUsuarios();
	
	let inscritosCurso = [];
	let matriculados = [];
	let lista = [];
	
	let longCursos = listaCursosB.length;
	let longMatriculados;
	
	let nombreCurso;
	let estado;
	let idCurso;
	let inscrito;
	
	for (let i = 0; i < longCursos; i++){
		matriculados = listaMatriculas.filter(objMat => objMat.idCurso == listaCursosB[i].id);
		longMatriculados = matriculados.length;
		for (let j = 0; j < longMatriculados; j++){
			inscrito = listaUsuarios.find(objUs => objUs.id == matriculados[j].idEst);
			inscritosCurso.push(inscrito);
		}
		nombreCurso = listaCursosB[i].nombre;
		idCurso = listaCursosB[i].id;
		estado = listaCursosB[i].estado;
		lista.push(new cursoInscritos(nombreCurso, idCurso, estado, inscritosCurso));
		inscritosCurso = [];
	}
	return lista;
}


const cambiarEstadoCurso = (curso) => {
	listarCursos();
	let index = listaCursos.findIndex(objCur => objCur.id == curso.idCurso);
	listaCursos[index].estado = 'cerrado';
	guardarCursos();
}


const eliminarMatricula = (matricula) => {
	listarMatriculas();
	let index = listaMatriculas.findIndex(objMat => {
		return ((objMat.idEst == matricula.idEst) && (objMat.idCurso == matricula.idCur));
	});
	console.log(index);
	listaMatriculas.splice(index, 1);
	guardarMatriculas();
}


module.exports = {
	crearCurso,
	listarCursosFormat,
	listarCursosDisponibles,
	realizarRegistro,
	verInscritosPorCurso,
	cambiarEstadoCurso,
	eliminarMatricula
}