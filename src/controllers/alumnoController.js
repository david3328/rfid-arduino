const {db} = require('../cfg/db');

const listar = (req,res)=>{
  db.any('SELECT id_alumno,nombres,apellido_paterno,apellido_materno,curso FROM alumnos')
    .then(function(data) {
        res.status(200).json(data);
    })
    .catch(function(error) {
        console.log(error.message);
    });
}

const insertar = (req,res)=>{
  let id_alumno = req.body.id_alumno;
  let nombres = req.body.nombres;
  let apellido_paterno = req.body.apellido_paterno;
  let apellido_materno = req.body.apellido_materno;
  let curso = req.body.curso;
  db.none('INSERT INTO alumnos VALUES($1, $2, $3, $4, $5)', [id_alumno,nombres,apellido_paterno,apellido_materno,curso])
    .then(() => {
        res.status(200).json({success:true,message:'Agregado correctamente'});
    })
    .catch(error => {
      console.log(error.message);
      res.status(400).json({success:false,message:'Ocurrio un error '+error.message});
    });
}

const buscar = (req,res)=>{
  let id_alumno = req.params.idAlumno;
  db.one('SELECT nombres,apellido_paterno,apellido_materno FROM alumnos WHERE id_alumno = $1',[id_alumno])
    .then(function(data) {
        res.status(200).json({success:true,data});
    })
    .catch(function(error) {
      // console.log(error.message);
        res.status(400).json({success:false,error});
    });
}
module.exports = {listar,insertar,buscar}